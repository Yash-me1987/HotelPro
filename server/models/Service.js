const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ['Room Service', 'Housekeeping', 'Maintenance', 'Concierge', 'Luggage'],
    },
    details: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Normal', 'High', 'Urgent'],
      default: 'Normal',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    assignedTo: {
      type: String,
      default: 'Pending Assignment',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
