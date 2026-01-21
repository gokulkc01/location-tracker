const express = require('express');
const router = express.Router();
const {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation
} = require('../controllers/InvitationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/send', sendInvitation);
router.get('/my', getMyInvitations);
router.post('/:invitationId/accept', acceptInvitation);
router.post('/:invitationId/reject', rejectInvitation);

module.exports = router;