const Geofence = require('../models/Geofence');
const Circle = require('../models/Circle');

exports.createGeofence = async (req, res, next) => {
  try {
    const { circleId, name, latitude, longitude, radius, notifyOnEnter, notifyOnExit } = req.body;

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

    const geofence = await Geofence.create({
      userId: req.user.id,
      circleId,
      name,
      latitude,
      longitude,
      radius: radius || 100,
      notifyOnEnter: notifyOnEnter !== false,
      notifyOnExit: notifyOnExit !== false
    });

    res.status(201).json({
      success: true,
      geofence
    });
  } catch (error) {
    next(error);
  }
};

exports.getGeofences = async (req, res, next) => {
  try {
    const { circleId } = req.query;

    const query = { userId: req.user.id };
    if (circleId) {
      query.circleId = circleId;
    }

    const geofences = await Geofence.find(query).populate('circleId', 'name');

    res.status(200).json({
      success: true,
      geofences
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGeofence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const geofence = await Geofence.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: 'Geofence not found'
      });
    }

    Object.assign(geofence, updates);
    await geofence.save();

    res.status(200).json({
      success: true,
      geofence
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGeofence = async (req, res, next) => {
  try {
    const { id } = req.params;

    const geofence = await Geofence.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!geofence) {
      return res.status(404).json({
        success: false,
        message: 'Geofence not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Geofence deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};