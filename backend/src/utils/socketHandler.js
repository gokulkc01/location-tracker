const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Location = require('../models/Location');
const Notification = require('../models/Notification');
const Geofence = require('../models/Geofence');
const Permission = require('../models/Permission');
const Circle = require('../models/Circle');
const { isInsideGeofence } = require('./geoUtils');

const connectedUsers = new Map(); // userId -> socketId

const initializeSocket = (io) => {
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

    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);

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

        console.log(`Location update from user ${socket.userId} for circle ${circleId}`);

        // Verify user is active member of circle
        const circle = await Circle.findById(circleId);
        if (!circle) {
          console.log(`Circle ${circleId} not found`);
          socket.emit('location-error', { message: 'Circle not found' });
          return;
        }

        const isMember = circle.members.some(
          m => m.userId.toString() === socket.userId && m.status === 'active'
        );

        if (!isMember) {
          console.log(`User ${socket.userId} is not an active member of circle ${circleId}`);
          console.log('Circle members:', circle.members.map(m => ({ id: m.userId.toString(), status: m.status })));
          socket.emit('location-error', { message: 'You are not a member of this circle' });
          return;
        }

        // Check if permission exists, create if not
        let permission = await Permission.findOne({
          circleId,
          userId: socket.userId
        });

        if (!permission) {
          // Create permission for this user
          const activeMemberIds = circle.members
            .filter(m => m.status === 'active')
            .map(m => m.userId);

          permission = await Permission.create({
            circleId,
            userId: socket.userId,
            sharingEnabled: true,
            allowedUsers: activeMemberIds
          });

          // Also update other members' permissions to include this user
          await Permission.updateMany(
            {
              circleId,
              userId: { $ne: socket.userId }
            },
            {
              $addToSet: { allowedUsers: socket.userId }
            }
          );

          console.log(`Created missing permission for user ${socket.userId} in circle ${circleId}`);
        }

        if (!permission.sharingEnabled) {
          socket.emit('location-error', { message: 'Location sharing is disabled' });
          return;
        }

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
          userEmail: socket.user.email,
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

          // Create notification
          await Notification.create({
            userId: socket.userId,
            type: 'low_battery',
            title: 'Low Battery',
            message: `Your battery is at ${battery}%`,
            data: { battery }
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

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

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