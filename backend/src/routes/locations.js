const express = require('express');
const router = express.Router();
const {
  updateLocation,
  getCircleLocations,
  getUserLocation,
  getLocationHistory
} = require('../controllers/locationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/update', updateLocation);
router.get('/circle/:circleId', getCircleLocations);
router.get('/user/:userId', getUserLocation);
router.get('/history/:userId', getLocationHistory);

module.exports = router;