const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  action: {
    type: String,
    enum: ['viewed_location', 'viewed_history'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

activityLogSchema.index({ viewedUserId: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
