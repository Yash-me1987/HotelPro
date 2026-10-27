const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  updateSeasonalPricing,
  getAvailabilityMatrix,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getRooms);
router.get('/availability/matrix', protect, authorize('staff', 'admin'), getAvailabilityMatrix);
router.get('/:id', getRoomById);
router.post('/', protect, authorize('staff', 'admin'), upload.array('images', 5), createRoom);
router.put('/:id', protect, authorize('staff', 'admin'), updateRoom);
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateRoomStatus);
router.patch('/pricing/multiplier', protect, authorize('admin'), updateSeasonalPricing);

module.exports = router;
