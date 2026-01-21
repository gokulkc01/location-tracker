const Invitation = require('../models/Invitation');
const Notification = require('../models/Notification');
const Circle = require('../models/Circle');
const User = require('../models/User');
const Permission = require('../models/Permission');

// Send invitation
exports.sendInvitation = async (req, res, next) => {
    try {
        const { circleId, email, message } = req.body;

        // Find circle
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
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Check if already a member
        const alreadyMember = circle.members.some(
            m => m.userId.toString() === userToInvite._id.toString()
        );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: 'User is already a member of this circle'
            });
        }

        // Check for existing pending invitation
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

        // Create invitation
        const invitation = await Invitation.create({
            circleId,
            invitedBy: req.user.id,
            invitedUser: userToInvite._id,
            message: message || `Join ${circle.name}`
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

        // Get socket instance and emit notification
        const io = req.app.get('io');
        if (io) {
            io.to(`user:${userToInvite._id}`).emit('notification', {
                notification,
                invitation: await invitation.populate([
                    { path: 'invitedBy', select: 'name email profilePicture' },
                    { path: 'circleId', select: 'name' }
                ])
            });
        }

        res.status(201).json({
            success: true,
            message: 'Invitation sent successfully',
            invitation
        });
    } catch (error) {
        next(error);
    }
};

// Get user's pending invitations
exports.getMyInvitations = async (req, res, next) => {
    try {
        const invitations = await Invitation.find({
            invitedUser: req.user.id,
            status: 'pending'
        })
            .populate('invitedBy', 'name email profilePicture')
            .populate('circleId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            invitations
        });
    } catch (error) {
        next(error);
    }
};

// Accept invitation
exports.acceptInvitation = async (req, res, next) => {
    try {
        const { invitationId } = req.params;

        const invitation = await Invitation.findOne({
            _id: invitationId,
            invitedUser: req.user.id,
            status: 'pending'
        });

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: 'Invitation not found'
            });
        }

        // Update invitation status
        invitation.status = 'accepted';
        invitation.respondedAt = new Date();
        await invitation.save();

        // Add user to circle
        const circle = await Circle.findById(invitation.circleId);
        circle.members.push({
            userId: req.user.id,
            role: 'member',
            status: 'active'
        });
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

        // Notify the person who sent the invitation
        const notification = await Notification.create({
            userId: invitation.invitedBy,
            type: 'invitation_accepted',
            title: 'Invitation Accepted',
            message: `${req.user.name} accepted your invitation to join "${circle.name}"`,
            data: {
                circleId: circle._id,
                circleName: circle.name,
                acceptedBy: req.user.name
            }
        });

        // Notify all circle members
        const io = req.app.get('io');
        if (io) {
            // Notify inviter
            io.to(`user:${invitation.invitedBy}`).emit('notification', notification);

            // Notify all circle members about new member
            circle.members.forEach(member => {
                if (member.userId.toString() !== req.user.id) {
                    io.to(`user:${member.userId}`).emit('member_joined', {
                        circleId: circle._id,
                        circleName: circle.name,
                        newMember: {
                            id: req.user.id,
                            name: req.user.name,
                            email: req.user.email
                        }
                    });
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Invitation accepted',
            circle
        });
    } catch (error) {
        next(error);
    }
};

// Reject invitation
exports.rejectInvitation = async (req, res, next) => {
    try {
        const { invitationId } = req.params;

        const invitation = await Invitation.findOne({
            _id: invitationId,
            invitedUser: req.user.id,
            status: 'pending'
        });

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: 'Invitation not found'
            });
        }

        invitation.status = 'rejected';
        invitation.respondedAt = new Date();
        await invitation.save();

        // Notify the person who sent the invitation
        const circle = await Circle.findById(invitation.circleId);
        const notification = await Notification.create({
            userId: invitation.invitedBy,
            type: 'invitation_rejected',
            title: 'Invitation Declined',
            message: `${req.user.name} declined your invitation to join "${circle.name}"`,
            data: {
                circleId: circle._id,
                circleName: circle.name
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`user:${invitation.invitedBy}`).emit('notification', notification);
        }

        res.status(200).json({
            success: true,
            message: 'Invitation rejected'
        });
    } catch (error) {
        next(error);
    }
};