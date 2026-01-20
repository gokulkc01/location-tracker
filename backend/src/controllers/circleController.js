const Circle = require('../models/Circle');
const Permission = require('../models/Permission');

exports.createCircle = async (req, res, next) => {
  try {
    const { name } = req.body;

    const circle = await Circle.create({
      name,
      createdBy: req.user.id,
      members: [{
        userId: req.user.id,
        role: 'admin',
        status: 'active'
      }]
    });

    // Create permission for creator
    await Permission.create({
      circleId: circle._id,
      userId: req.user.id,
      sharingEnabled: true,
      allowedUsers: []
    });

    res.status(201).json({
      success: true,
      circle
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyCircles = async (req, res, next) => {
  try {
    const circles = await Circle.find({
      'members.userId': req.user.id,
      'members.status': 'active'
    }).populate('members.userId', 'name email profilePicture');

    res.status(200).json({
      success: true,
      circles
    });
  } catch (error) {
    next(error);
  }
};

exports.inviteMember = async (req, res, next) => {
  try {
    const { circleId } = req.params;
    const { email } = req.body;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    // Check if requester is admin
    const isAdmin = circle.members.some(
      m => m.userId.toString() === req.user.id && m.role === 'admin'
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can invite members'
      });
    }

    // Find user to invite
    const User = require('../models/User');
    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a member
    const alreadyMember = circle.members.some(
      m => m.userId.toString() === userToInvite._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member or has pending invitation'
      });
    }

    // Add member with pending status
    circle.members.push({
      userId: userToInvite._id,
      role: 'member',
      status: 'pending'
    });

    await circle.save();

    // Emit socket event to notify the invited user
    const io = req.app.get('io');
    if (io) {
      io.emit('circle-invitation', {
        recipientId: userToInvite._id.toString(),
        circleId: circle._id,
        circleName: circle.name,
        invitedBy: req.user.name || req.user.email,
        invitedByEmail: req.user.email,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    const member = circle.members.find(
      m => m.userId.toString() === req.user.id && m.status === 'pending'
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    member.status = 'active';
    await circle.save();

    // Create permission for new member
    await Permission.create({
      circleId: circle._id,
      userId: req.user.id,
      sharingEnabled: true,
      allowedUsers: circle.members
        .filter(m => m.status === 'active')
        .map(m => m.userId)
    });

    // Emit socket event to notify circle members
    const io = req.app.get('io');
    if (io) {
      io.to(`circle:${circleId}`).emit('member-joined', {
        circleId: circle._id,
        userId: req.user.id,
        userName: req.user.name,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invitation accepted'
    });
  } catch (error) {
    next(error);
  }
};

exports.leaveCircle = async (req, res, next) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    circle.members = circle.members.filter(
      m => m.userId.toString() !== req.user.id
    );

    await circle.save();

    // Delete permission
    await Permission.deleteOne({ circleId, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Left circle successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get pending invitations for current user
exports.getPendingInvitations = async (req, res, next) => {
  try {
    const circles = await Circle.find({
      'members.userId': req.user.id,
      'members.status': 'pending'
    }).populate('createdBy', 'name email');

    const invitations = circles.map(circle => ({
      circleId: circle._id,
      circleName: circle.name,
      invitedBy: circle.createdBy?.name || 'Unknown',
      invitedByEmail: circle.createdBy?.email,
      createdAt: circle.createdAt
    }));

    res.status(200).json({
      success: true,
      invitations
    });
  } catch (error) {
    next(error);
  }
};

// Decline invitation
exports.declineInvitation = async (req, res, next) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    const memberIndex = circle.members.findIndex(
      m => m.userId.toString() === req.user.id && m.status === 'pending'
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    circle.members.splice(memberIndex, 1);
    await circle.save();

    res.status(200).json({
      success: true,
      message: 'Invitation declined'
    });
  } catch (error) {
    next(error);
  }
};