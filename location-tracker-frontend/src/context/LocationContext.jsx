import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from './SocketContext';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const { updateLocation } = useContext(SocketContext);
  const circleIdRef = useRef(null);
  const intervalRef = useRef(null);

  const startTracking = (circleId) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    circleIdRef.current = circleId;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          circleId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          battery: navigator.getBattery ? null : 100, // Will implement battery API
        };

        setCurrentLocation(locationData);
        updateLocation(locationData);
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000, // Allow slightly cached position for background tabs
      }
    );

    // Also set up a backup interval for background tabs (every 30 seconds)
    intervalRef.current = setInterval(() => {
      if (circleIdRef.current) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              circleId: circleIdRef.current,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              battery: null,
            };
            updateLocation(locationData);
          },
          () => { }, // Silently fail
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
        );
      }
    }, 30000);

    setWatchId(id);
    setTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    circleIdRef.current = null;
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [watchId]);

  const value = {
    currentLocation,
    tracking,
    error,
    startTracking,
    stopTracking,
    getCurrentPosition,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};