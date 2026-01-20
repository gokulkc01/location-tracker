const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Location = require('../models/Location');
const Geofence = require('../models/Geofence');
const { isInsideGeofence } = require('./geoUtils');

const connectedUsers = new Map(); // userId -> socketId

const initializeSocket = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id);

    // Join circle rooms
    socket.on('join-circles', async (circleIds) => {
      try {
        circleIds.forEach(circleId => {
          socket.join(`circle:${circleId}`);
          console.log(`User ${socket.userId} joined circle ${circleId}`);
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join circles' });
      }
    });

    // Handle location updates
    socket.on('location-update', async (data) => {
      try {
        const { circleId, latitude, longitude, accuracy, battery } = data;

        // Save location to database
        const location = await Location.create({
          userId: socket.userId,
          circleId,
          latitude,
          longitude,
          accuracy,
          battery
        });

        // Broadcast to circle members
        io.to(`circle:${circleId}`).emit('location-updated', {
          userId: socket.userId,
          userName: socket.user.name,
          location: {
            latitude,
            longitude,
            accuracy,
            battery,
            timestamp: location.timestamp
          }
        });

        // Check geofences
        await checkGeofences(socket.userId, circleId, latitude, longitude, io);

        // Low battery alert
        if (battery && battery < 20) {
          io.to(`circle:${circleId}`).emit('low-battery-alert', {
            userId: socket.userId,
            userName: socket.user.name,
            battery
          });
        }

      } catch (error) {
        console.error('Location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Handle SOS alerts
    socket.on('sos-alert', async (data) => {
      try {
        const { circleId, latitude, longitude, message } = data;

        // Broadcast SOS to all circle members
        io.to(`circle:${circleId}`).emit('sos-received', {
          userId: socket.userId,
          userName: socket.user.name,
          location: { latitude, longitude },
          message: message || 'Emergency alert!',
          timestamp: new Date()
        });

        console.log(`SOS alert from ${socket.userId} in circle ${circleId}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send SOS alert' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

// Check if user entered/exited any geofences
const checkGeofences = async (userId, circleId, latitude, longitude, io) => {
  try {
    const geofences = await Geofence.find({ circleId });

    for (const fence of geofences) {
      const isInside = isInsideGeofence(
        latitude,
        longitude,
        fence.latitude,
        fence.longitude,
        fence.radius
      );

      // You would need to track previous state to determine enter/exit
      // For simplicity, we'll just emit if inside
      if (isInside) {
        io.to(`circle:${circleId}`).emit('geofence-event', {
          userId,
          geofenceName: fence.name,
          eventType: 'entered',
          timestamp: new Date()
        });
      }
    }
  } catch (error) {
    console.error('Geofence check error:', error);
  }
};

module.exports = { initializeSocket };