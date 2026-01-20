const express = require('express');
const router = express.Router();
const {
  toggleSharing,
  updateSchedule,
  getActivityLog,
  getMyPermissions
} = require('../controllers/permissionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.put('/toggle', toggleSharing);
router.put('/schedule', updateSchedule);
router.get('/activity', getActivityLog);
router.get('/my', getMyPermissions);

module.exports = router;