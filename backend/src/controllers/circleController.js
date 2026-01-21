const Circle = require('../models/Circle');
const Permission = require('../models/Permission');
const Invitation = require('../models/Invitation');
const Notification = require('../models/Notification');

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

    // Check for existing pending invitation in Invitation collection
    const existingInvitation = await Invitation.findOne({
      circleId,
      invitedUser: userToInvite._id,
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: 'Invitation already sent to this user'
      });
    }

    // Create invitation document (so it shows in Invitations page)
    const invitation = await Invitation.create({
      circleId,
      invitedBy: req.user.id,
      invitedUser: userToInvite._id,
      message: `Join ${circle.name}`
    });

    // Create notification for invited user
    const notification = await Notification.create({
      userId: userToInvite._id,
      type: 'invitation',
      title: 'Circle Invitation',
      message: `${req.user.name} invited you to join "${circle.name}"`,
      data: {
        invitationId: invitation._id,
        circleId: circle._id,
        circleName: circle.name,
        invitedBy: req.user.name
      }
    });

    await circle.save();

    // Emit socket event to notify the invited user
    const io = req.app.get('io');
    if (io) {
      // Send to user's personal room
      io.to(`user:${userToInvite._id}`).emit('notification', {
        notification,
        invitation: await invitation.populate([
          { path: 'invitedBy', select: 'name email profilePicture' },
          { path: 'circleId', select: 'name' }
        ])
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

    // Get all active member IDs including the new member
    const activeMemberIds = circle.members
      .filter(m => m.status === 'active')
      .map(m => m.userId);

    // Create permission for new member
    await Permission.create({
      circleId: circle._id,
      userId: req.user.id,
      sharingEnabled: true,
      allowedUsers: activeMemberIds
    });

    // Update existing members' permissions to include the new member
    await Permission.updateMany(
      {
        circleId: circle._id,
        userId: { $ne: req.user.id }
      },
      {
        $addToSet: { allowedUsers: req.user.id }
      }
    );

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

// Sync permissions for all circle members (fixes missing permissions)
exports.syncCirclePermissions = async (req, res, next) => {
  try {
    const { circleId } = req.params;

    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Circle not found'
      });
    }

    // Check if requester is member of circle
    const isMember = circle.members.some(
      m => m.userId.toString() === req.user.id && m.status === 'active'
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this circle'
      });
    }

    // Get all active member IDs
    const activeMemberIds = circle.members
      .filter(m => m.status === 'active')
      .map(m => m.userId);

    // Create or update permissions for all active members
    const results = await Promise.all(
      activeMemberIds.map(async (userId) => {
        const existingPermission = await Permission.findOne({
          circleId: circle._id,
          userId
        });

        if (!existingPermission) {
          // Create new permission
          await Permission.create({
            circleId: circle._id,
            userId,
            sharingEnabled: true,
            allowedUsers: activeMemberIds
          });
          return { userId, action: 'created' };
        } else {
          // Update existing permission to include all members
          await Permission.updateOne(
            { _id: existingPermission._id },
            { $addToSet: { allowedUsers: { $each: activeMemberIds } } }
          );
          return { userId, action: 'updated' };
        }
      })
    );

    res.status(200).json({
      success: true,
      message: 'Permissions synced successfully',
      results
    });
  } catch (error) {
    next(error);
  }
};