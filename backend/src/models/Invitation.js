const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
});

// Index for efficient queries
invitationSchema.index({ invitedUser: 1, status: 1 });
invitationSchema.index({ circleId: 1, invitedUser: 1 });

module.exports = mongoose.model('Invitation', invitationSchema);