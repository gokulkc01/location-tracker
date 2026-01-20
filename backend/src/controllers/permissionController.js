const Permission = require('../models/Permission');
const ActivityLog = require('../models/ActivityLog');

exports.toggleSharing = async (req, res, next) => {
  try {
    const { circleId, sharingEnabled } = req.body;

    let permission = await Permission.findOne({
      circleId,
      userId: req.user.id
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    permission.sharingEnabled = sharingEnabled;
    await permission.save();

    res.status(200).json({
      success: true,
      message: `Location sharing ${sharingEnabled ? 'enabled' : 'disabled'}`,
      permission
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { circleId, enabled, startTime, endTime } = req.body;

    let permission = await Permission.findOne({
      circleId,
      userId: req.user.id
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    permission.sharingSchedule = {
      enabled,
      startTime,
      endTime
    };

    await permission.save();

    res.status(200).json({
      success: true,
      message: 'Sharing schedule updated',
      permission
    });
  } catch (error) {
    next(error);
  }
};

exports.getActivityLog = async (req, res, next) => {
  try {
    const { circleId, days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      viewedUserId: req.user.id,
      timestamp: { $gte: startDate }
    };

    if (circleId) {
      query.circleId = circleId;
    }

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .populate('viewerId', 'name email')
      .populate('circleId', 'name');

    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find({
      userId: req.user.id
    }).populate('circleId', 'name');

    res.status(200).json({
      success: true,
      permissions
    });
  } catch (error) {
    next(error);
  }
};