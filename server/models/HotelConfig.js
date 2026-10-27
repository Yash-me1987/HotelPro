const mongoose = require('mongoose');

const hotelConfigSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      default: 'HotelPro Grand Palace & Spa',
    },
    taxRatePercent: {
      type: Number,
      default: 12,
    },
    resortFeePerNight: {
      type: Number,
      default: 35,
    },
    currency: {
      type: String,
      default: 'USD ($)',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    contactEmail: {
      type: String,
      default: 'concierge@hotelpro-luxury.com',
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 789-0123',
    },
    seasonalSurges: {
      type: Map,
      of: Number,
      default: {
        summer: 1.25,
        winterHolidays: 1.4,
        weekendPeak: 1.15,
        springLow: 0.9,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HotelConfig', hotelConfigSchema);
