const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharingEnabled: {
    type: Boolean,
    default: true
  },
  sharingSchedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    startTime: String,
    endTime: String
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Permission', permissionSchema);