const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
    bookingCode: {
      type: String,
      required: false,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestName: {
      type: String,
      required: [true, 'Please provide guest name'],
    },
    guestEmail: {
      type: String,
      required: [true, 'Please provide guest email'],
    },
    guestPhone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: false,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomTitle: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: String,
      required: true,
    },
    checkOutDate: {
      type: String,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    guestsCount: {
      type: Number,
      required: true,
      default: 2,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      default: 'Stripe Credit Card',
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
      default: 'Confirmed',
    },
    specialRequests: {
      type: String,
      default: 'None',
    },
    digitalKeyIssued: {
      type: Boolean,
      default: true,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
