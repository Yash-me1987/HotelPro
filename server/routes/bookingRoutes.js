const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  checkInGuest,
  checkOutGuest,
  getActiveStay,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', createBooking);
router.get('/', protect, getBookings);
router.get('/active/stay', protect, getActiveStay);
router.get('/:id', protect, getBookingById);
router.post('/:id/cancel', protect, cancelBooking);
router.post('/:id/checkin', protect, authorize('staff', 'admin'), checkInGuest);
router.post('/:id/checkout', protect, authorize('staff', 'admin'), checkOutGuest);

module.exports = router;
