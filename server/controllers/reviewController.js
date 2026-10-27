const Review = require('../models/Review');
const Room = require('../models/Room');
const { getDBStatus } = require('../config/db');
const { inMemoryRooms } = require('./roomController');

let inMemoryReviews = [
  {
    _id: 'rev_01',
    roomId: 'PH-01',
    guestName: 'Lord Alistair Sterling',
    rating: 5,
    title: 'An Unrivaled Sanctuary in the Sky',
    comment: 'The private plunge pool overlooking the city lights accompanied by the sommelier-curated champagne pairing was truly transcendent.',
    verifiedStay: true,
    stayDate: 'October 2026',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'rev_02',
    roomId: 'PH-01',
    guestName: 'Genevieve Dupond',
    rating: 5,
    title: 'Flawless Digital Key & Butler Execution',
    comment: 'Zero friction from curbside arrival to penthouse suite. The acoustic isolation gave us the best sleep of our lives.',
    verifiedStay: true,
    stayDate: 'September 2026',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'rev_03',
    roomId: 'SU-402',
    guestName: 'Marcus Aurelius Vance',
    rating: 5,
    title: 'Spectacular Coastal Panoramic Terrace',
    comment: 'The sunsets over the ocean from the wraparound terrace are breathtaking. Michelin-standard room service breakfast is a must.',
    verifiedStay: true,
    stayDate: 'October 2026',
    createdAt: new Date().toISOString(),
  },
];

// @desc    Get reviews for a room or all hotel reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { roomId } = req.query;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let filter = {};
      if (roomId) {
        if (roomId.match(/^[0-9a-fA-F]{24}$/)) {
          filter = { $or: [{ room: roomId }, { roomId }] };
        } else {
          filter = { roomId };
        }
      }
      const reviews = await Review.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: reviews.length, data: reviews });
    } else {
      let result = [...inMemoryReviews];
      if (roomId) {
        result = result.filter((r) => r.roomId === roomId);
      }
      return res.json({ success: true, count: result.length, data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post a verified guest review
// @route   POST /api/reviews
// @access  Public / Authenticated
const createReview = async (req, res) => {
  try {
    const { roomId, guestName, rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, title, and comments',
      });
    }

    const reviewData = {
      roomId: roomId || 'PH-01',
      guestName: guestName || (req.user ? req.user.name : 'Verified Resident'),
      rating: Number(rating),
      title,
      comment,
      verifiedStay: true,
      stayDate: 'October 2026',
    };

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const created = await Review.create(reviewData);

      // Recalculate room review metrics
      const roomReviews = await Review.find({ roomId: reviewData.roomId });
      const avg = roomReviews.reduce((sum, r) => sum + r.rating, 0) / (roomReviews.length || 1);

      await Room.findOneAndUpdate(
        { roomNumber: reviewData.roomId },
        { rating: Number(avg.toFixed(2)), reviewCount: roomReviews.length }
      );

      return res.status(201).json({ success: true, data: created });
    } else {
      const newReview = {
        _id: 'rev_' + Date.now(),
        ...reviewData,
        createdAt: new Date().toISOString(),
      };
      inMemoryReviews.unshift(newReview);

      // Update in-memory room
      const room = inMemoryRooms.find((r) => r.roomNumber === reviewData.roomId);
      if (room) {
        room.reviewCount = (room.reviewCount || 0) + 1;
        room.rating = 4.95;
      }

      return res.status(201).json({ success: true, data: newReview });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  inMemoryReviews,
};
