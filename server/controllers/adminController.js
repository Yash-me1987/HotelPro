const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const HotelConfig = require('../models/HotelConfig');
const { getDBStatus } = require('../config/db');
const { inMemoryRooms } = require('./roomController');
const { inMemoryBookings } = require('./bookingController');
const { inMemoryUsers } = require('./authController');

let inMemoryConfig = {
  hotelName: 'HotelPro Grand Palace & Spa',
  taxRatePercent: 12,
  resortFeePerNight: 35,
  currency: 'USD ($)',
  maintenanceMode: false,
  contactEmail: 'concierge@hotelpro-luxury.com',
  contactPhone: '+1 (555) 789-0123',
};

let inMemoryAuditLogs = [
  {
    id: 'LOG-901',
    timestamp: '2026-10-27 02:40:12',
    user: 'Julian Vance (Admin)',
    action: 'Seasonal Dynamic Multiplier Adjusted',
    details: 'Holiday surge set to 1.25x across Penthouse & Presidential suites',
    severity: 'Info',
  },
  {
    id: 'LOG-900',
    timestamp: '2026-10-27 01:15:44',
    user: 'Elena Rostova (Staff)',
    action: 'Express Check-In Authorized',
    details: 'Digital Smart Key emitted for Suite PH-01 (Eleanor Sterling)',
    severity: 'Normal',
  },
  {
    id: 'LOG-899',
    timestamp: '2026-10-26 23:55:02',
    user: 'System Automated',
    action: 'Stripe Settlement Reconciliation',
    details: 'Batch payout settled: $11,150.00 USD',
    severity: 'Success',
  },
];

// @desc    Get executive KPIs and analytics charts data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    const dbConnected = getDBStatus().connected;

    let totalRevenue = 0;
    let activeBookingsCount = 0;
    let totalRoomsCount = 0;
    let occupiedRoomsCount = 0;

    if (dbConnected) {
      const bookings = await Booking.find();
      const rooms = await Room.find();

      totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      activeBookingsCount = bookings.filter((b) => b.bookingStatus !== 'Cancelled').length;
      totalRoomsCount = rooms.length || 4;
      occupiedRoomsCount = rooms.filter((r) => r.status === 'Dirty' || !r.isAvailable).length;
    } else {
      totalRevenue = inMemoryBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      activeBookingsCount = inMemoryBookings.filter((b) => b.bookingStatus !== 'Cancelled').length;
      totalRoomsCount = inMemoryRooms.length || 4;
      occupiedRoomsCount = inMemoryRooms.filter((r) => r.status === 'Dirty' || !r.isAvailable).length;
    }

    const occupancyPercent = Math.round((occupiedRoomsCount / (totalRoomsCount || 1)) * 100) || 72;
    const adr = Math.round(totalRevenue / (activeBookingsCount || 1)) || 980;
    const revpar = Math.round(adr * (occupancyPercent / 100)) || 705;

    const monthlyRevenue = [
      { month: 'May', revenue: 42000, bookings: 64 },
      { month: 'Jun', revenue: 68000, bookings: 98 },
      { month: 'Jul', revenue: 95000, bookings: 135 },
      { month: 'Aug', revenue: 110000, bookings: 158 },
      { month: 'Sep', revenue: 78000, bookings: 112 },
      { month: 'Oct', revenue: totalRevenue > 0 ? totalRevenue : 92400, bookings: 129 },
    ];

    const categoryShare = [
      { name: 'Penthouse', value: 45, color: '#fef08a' },
      { name: 'Presidential', value: 30, color: '#556b2f' },
      { name: 'Executive', value: 15, color: '#84cc16' },
      { name: 'Deluxe', value: 10, color: '#fde047' },
    ];

    const occupancyWeekly = [
      { day: 'Mon', rate: 68 },
      { day: 'Tue', rate: 74 },
      { day: 'Wed', rate: 82 },
      { day: 'Thu', rate: 88 },
      { day: 'Fri', rate: 96 },
      { day: 'Sat', rate: 98 },
      { day: 'Sun', rate: 75 },
    ];

    return res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          activeBookingsCount,
          totalRoomsCount,
          occupancyPercent,
          adr,
          revpar,
        },
        monthlyRevenue,
        categoryShare,
        occupancyWeekly,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const users = await User.find().select('-password');
      return res.json({ success: true, count: users.length, data: users });
    } else {
      const sanitized = inMemoryUsers.map(({ passwordHash, ...rest }) => rest);
      return res.json({ success: true, count: sanitized.length, data: sanitized });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (promote/demote)
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['guest', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    } else {
      const user = inMemoryUsers.find((u) => String(u._id) === String(id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.role = role;
      const { passwordHash, ...rest } = user;
      return res.json({ success: true, data: rest });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get audit trail
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
const getAuditLogs = async (req, res) => {
  return res.json({ success: true, count: inMemoryAuditLogs.length, data: inMemoryAuditLogs });
};

// @desc    Get hotel global config
// @route   GET /api/admin/config
// @access  Public / Private
const getHotelConfig = async (req, res) => {
  try {
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let config = await HotelConfig.findOne();
      if (!config) {
        config = await HotelConfig.create(inMemoryConfig);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryConfig });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hotel global configuration
// @route   PUT /api/admin/config
// @access  Private (Admin)
const updateHotelConfig = async (req, res) => {
  try {
    const { hotelName, taxRatePercent, resortFeePerNight, currency, maintenanceMode } = req.body;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let config = await HotelConfig.findOne();
      if (!config) {
        config = new HotelConfig();
      }

      if (hotelName !== undefined) config.hotelName = hotelName;
      if (taxRatePercent !== undefined) config.taxRatePercent = Number(taxRatePercent);
      if (resortFeePerNight !== undefined) config.resortFeePerNight = Number(resortFeePerNight);
      if (currency !== undefined) config.currency = currency;
      if (maintenanceMode !== undefined) config.maintenanceMode = maintenanceMode;

      await config.save();
      return res.json({ success: true, data: config });
    } else {
      if (hotelName !== undefined) inMemoryConfig.hotelName = hotelName;
      if (taxRatePercent !== undefined) inMemoryConfig.taxRatePercent = Number(taxRatePercent);
      if (resortFeePerNight !== undefined) inMemoryConfig.resortFeePerNight = Number(resortFeePerNight);
      if (currency !== undefined) inMemoryConfig.currency = currency;
      if (maintenanceMode !== undefined) inMemoryConfig.maintenanceMode = maintenanceMode;

      return res.json({ success: true, data: inMemoryConfig });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  updateUserRole,
  getAuditLogs,
  getHotelConfig,
  updateHotelConfig,
};
