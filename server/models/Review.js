const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: false,
    },
    roomId: {
      type: String,
      required: false,
    },
    guestName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    verifiedStay: {
      type: Boolean,
      default: true,
    },
    stayDate: {
      type: String,
      default: 'October 2026',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
