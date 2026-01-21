const express = require('express');
const router = express.Router();
const {
  createCircle,
  getMyCircles,
  inviteMember,
  acceptInvitation,
  declineInvitation,
  leaveCircle,
  getPendingInvitations,
  syncCirclePermissions
} = require('../controllers/circleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createCircle);
router.get('/', getMyCircles);
router.get('/invitations', getPendingInvitations);
router.post('/:circleId/invite', inviteMember);
router.post('/:circleId/accept', acceptInvitation);
router.post('/:circleId/decline', declineInvitation);
router.post('/:circleId/sync-permissions', syncCirclePermissions);
router.delete('/:circleId/leave', leaveCircle);

module.exports = router;