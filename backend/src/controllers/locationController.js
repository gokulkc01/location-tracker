const Location = require('../models/Location');
const Permission = require('../models/Permission');
const ActivityLog = require('../models/ActivityLog');
const Circle = require('../models/Circle');

exports.updateLocation = async (req, res, next) => {
  try {
    const { circleId, latitude, longitude, accuracy, battery } = req.body;

    // Verify user is member of circle
    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    const isMember = circle.members.some(
      m => m.userId.toString() === req.user.id && m.status === 'active'
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this circle'
      });
    }

    // Check if sharing is enabled
    const permission = await Permission.findOne({
      circleId,
      userId: req.user.id
    });

    if (!permission || !permission.sharingEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Location sharing is disabled'
      });
    }

    // Create location record
    const location = await Location.create({
      userId: req.user.id,
      circleId,
      latitude,
      longitude,
      accuracy: accuracy || 0,
      battery: battery || null
    });

    res.status(201).json({
      success: true,
      location
    });
  } catch (error) {
    next(error);
  }
};

exports.getCircleLocations = async (req, res, next) => {
  try {
    const { circleId } = req.params;

    // Verify user is member of circle
    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    const isMember = circle.members.some(
      m => m.userId.toString() === req.user.id && m.status === 'active'
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this circle'
      });
    }

    // Get latest location for each member
    const memberIds = circle.members
      .filter(m => m.status === 'active')
      .map(m => m.userId);

    const locations = await Promise.all(
      memberIds.map(async (userId) => {
        const location = await Location.findOne({
          userId,
          circleId
        })
          .sort({ timestamp: -1 })
          .limit(1)
          .populate('userId', 'name email profilePicture');

        return location;
      })
    );

    // Filter out null locations
    const validLocations = locations.filter(loc => loc !== null);

    res.status(200).json({
      success: true,
      locations: validLocations
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserLocation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { circleId } = req.query;

    if (!circleId) {
      return res.status(400).json({
        success: false,
        message: 'Circle ID is required'
      });
    }

    // Verify requester is member of circle
    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    const isMember = circle.members.some(
      m => m.userId.toString() === req.user.id && m.status === 'active'
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this circle'
      });
    }

    // Check if target user has given permission
    const permission = await Permission.findOne({
      circleId,
      userId
    });

    if (!permission || !permission.sharingEnabled) {
      return res.status(403).json({
        success: false,
        message: 'User has disabled location sharing'
      });
    }

    // Get latest location
    const location = await Location.findOne({
      userId,
      circleId
    })
      .sort({ timestamp: -1 })
      .populate('userId', 'name email profilePicture');

    // Log activity
    await ActivityLog.create({
      viewerId: req.user.id,
      viewedUserId: userId,
      circleId,
      action: 'viewed_location'
    });

    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    next(error);
  }
};

exports.getLocationHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { circleId, startDate, endDate, limit = 100 } = req.query;

    if (!circleId) {
      return res.status(400).json({
        success: false,
        message: 'Circle ID is required'
      });
    }

    // Verify permissions (same as getUserLocation)
    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    const isMember = circle.members.some(
      m => m.userId.toString() === req.user.id && m.status === 'active'
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this circle'
      });
    }

    // Build query
    const query = {
      userId,
      circleId
    };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const locations = await Location.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    // Log activity
    await ActivityLog.create({
      viewerId: req.user.id,
      viewedUserId: userId,
      circleId,
      action: 'viewed_history'
    });

    res.status(200).json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    next(error);
  }
};