const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.put('/:notificationId/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:notificationId', deleteNotification);

module.exports = router;