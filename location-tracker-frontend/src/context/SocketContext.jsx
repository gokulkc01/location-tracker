import { createContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { authService } from '../services/authService';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const socketRef = useRef(null);

    const addNotification = useCallback((notification) => {
        setNotifications((prev) => [
            { ...notification, id: Date.now(), timestamp: new Date() },
            ...prev.slice(0, 49),
        ]);
    }, []);

    const clearNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearInvitation = useCallback((circleId) => {
        setPendingInvitations((prev) => prev.filter((inv) => inv.circleId !== circleId));
    }, []);

    useEffect(() => {
        const token = authService.getToken();
        if (!token) return;

        const newSocket = io(SOCKET_URL, {
            auth: { token },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        newSocket.on('location-updated', (data) => {
            console.log('Location updated:', data);
        });

        newSocket.on('sos-received', (data) => {
            addNotification({
                type: 'sos',
                title: 'SOS Alert!',
                message: `${data.userName} needs help!`,
                data,
            });
        });

        newSocket.on('low-battery-alert', (data) => {
            addNotification({
                type: 'warning',
                title: 'Low Battery',
                message: `${data.userName}'s battery is at ${data.battery}%`,
                data,
            });
        });

        newSocket.on('geofence-event', (data) => {
            addNotification({
                type: 'info',
                title: 'Geofence Alert',
                message: `Someone ${data.eventType} ${data.geofenceName}`,
                data,
            });
        });

        newSocket.on('circle-invitation', (data) => {
            const currentUserId = authService.getCurrentUser()?.id;
            if (data.recipientId === currentUserId) {
                setPendingInvitations((prev) => [
                    { ...data, id: Date.now() },
                    ...prev,
                ]);
                addNotification({
                    type: 'invitation',
                    title: 'Circle Invitation',
                    message: `${data.invitedBy} invited you to join "${data.circleName}"`,
                    data,
                });
            }
        });

        newSocket.on('member-joined', (data) => {
            addNotification({
                type: 'success',
                title: 'New Member',
                message: `${data.userName} joined the circle`,
                data,
            });
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [addNotification]);

    const joinCircles = useCallback((circleIds) => {
        if (socketRef.current && connected) {
            socketRef.current.emit('join-circles', circleIds);
        }
    }, [connected]);

    const updateLocation = useCallback((data) => {
        if (socketRef.current && connected) {
            socketRef.current.emit('location-update', data);
        }
    }, [connected]);

    const sendSOS = useCallback((data) => {
        if (socketRef.current && connected) {
            socketRef.current.emit('sos-alert', data);
        }
    }, [connected]);

    const value = {
        socket,
        connected,
        notifications,
        pendingInvitations,
        clearNotification,
        clearInvitation,
        joinCircles,
        updateLocation,
        sendSOS,
    };

    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
};
