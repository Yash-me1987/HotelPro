const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateServiceStatus,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getServices);
router.post('/', protect, createService);
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateServiceStatus);

module.exports = router;
