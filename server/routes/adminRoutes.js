const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  updateUserRole,
  getAuditLogs,
  getHotelConfig,
  updateHotelConfig,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/users', protect, authorize('admin'), getUsers);
router.patch('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.get('/audit-logs', protect, authorize('admin'), getAuditLogs);
router.get('/config', getHotelConfig);
router.put('/config', protect, authorize('admin'), updateHotelConfig);

module.exports = router;
