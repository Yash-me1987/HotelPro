const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { getDBStatus } = require('../config/db');
const { initialBookings } = require('../utils/seedData');
const { sendBookingConfirmation, sendCancellationNotice } = require('../utils/mailer');
const { inMemoryRooms } = require('./roomController');

// Resilient in-memory booking store
let inMemoryBookings = JSON.parse(JSON.stringify(initialBookings));

// Generate unique booking reference
const generateReference = () => {
  return 'HP-' + Math.floor(1000 + Math.random() * 9000);
};

// @desc    Create a new booking / reservation
// @route   POST /api/bookings
// @access  Public / Authenticated
const createBooking = async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomNumber,
      roomTitle,
      checkInDate,
      checkOutDate,
      nights = 1,
      guestsCount = 2,
      totalAmount,
      paymentMethod = 'Stripe Credit Card',
      specialRequests = 'None',
      stripePaymentIntentId,
    } = req.body;

    if (!guestName || !guestEmail || !roomNumber || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory reservation details',
      });
    }

    const bookingReference = generateReference();
    const guestId = req.user ? req.user._id : null;

    const bookingData = {
      bookingReference,
      bookingCode: bookingReference,
      guest: guestId,
      guestName,
      guestEmail,
      guestPhone: guestPhone || '+1 (555) 392-8172',
      roomNumber,
      roomTitle: roomTitle || `Suite ${roomNumber}`,
      checkInDate,
      checkOutDate,
      nights: Number(nights) || 1,
      guestsCount: Number(guestsCount) || 2,
      totalAmount: Number(totalAmount) || 1200,
      paymentStatus: 'Paid',
      paymentMethod,
      stripePaymentIntentId: stripePaymentIntentId || 'pi_mock_' + Date.now(),
      bookingStatus: 'Confirmed',
      specialRequests,
      digitalKeyIssued: true,
      refundAmount: 0,
    };

    const dbConnected = getDBStatus().connected;

    let createdBooking;
    if (dbConnected) {
      createdBooking = await Booking.create(bookingData);
    } else {
      createdBooking = {
        _id: 'bk_' + Date.now(),
        ...bookingData,
        createdAt: new Date().toISOString(),
      };
      inMemoryBookings.unshift(createdBooking);
    }

    // Trigger confirmation email
    sendBookingConfirmation(createdBooking).catch((err) =>
      console.warn('[Email Warning]', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Reservation successfully created and secured',
      data: createdBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings (filtered by role or user)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const { status, guestEmail } = req.query;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let query = {};

      if (req.user && req.user.role === 'guest') {
        query.guestEmail = req.user.email;
      } else if (guestEmail) {
        query.guestEmail = guestEmail;
      }

      if (status && status !== 'all') {
        query.bookingStatus = status;
      }

      const bookings = await Booking.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: bookings.length, data: bookings });
    } else {
      let result = [...inMemoryBookings];

      if (req.user && req.user.role === 'guest') {
        result = result.filter(
          (b) =>
            b.guestEmail.toLowerCase() === req.user.email.toLowerCase() ||
            b.guestName.toLowerCase().includes('eleanor')
        );
      } else if (guestEmail) {
        result = result.filter((b) => b.guestEmail.toLowerCase() === guestEmail.toLowerCase());
      }

      if (status && status !== 'all') {
        result = result.filter((b) => b.bookingStatus === status);
      }

      return res.json({ success: true, count: result.length, data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by reference or ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const booking = await Booking.findOne({
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          { bookingReference: id },
        ],
      });

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }
      return res.json({ success: true, data: booking });
    } else {
      const booking = inMemoryBookings.find(
        (b) => b._id === id || b.bookingReference === id
      );
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }
      return res.json({ success: true, data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel reservation with automated refund
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Guest itinerary change' } = req.body;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const booking = await Booking.findOne({
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          { bookingReference: id },
        ],
      });

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      booking.bookingStatus = 'Cancelled';
      booking.paymentStatus = 'Refunded';
      booking.refundAmount = booking.totalAmount;
      booking.specialRequests += ` [Cancelled: ${reason}]`;
      await booking.save();

      sendCancellationNotice(booking).catch(() => {});

      return res.json({
        success: true,
        message: `Reservation #${booking.bookingReference} cancelled. Full refund of $${booking.totalAmount} processed.`,
        data: booking,
      });
    } else {
      const booking = inMemoryBookings.find(
        (b) => b._id === id || b.bookingReference === id
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      booking.bookingStatus = 'Cancelled';
      booking.paymentStatus = 'Refunded';
      booking.refundAmount = booking.totalAmount;
      booking.specialRequests += ` [Cancelled: ${reason}]`;

      sendCancellationNotice(booking).catch(() => {});

      return res.json({
        success: true,
        message: `Reservation #${booking.bookingReference} cancelled. Full refund of $${booking.totalAmount} processed.`,
        data: booking,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Express Check-In
// @route   POST /api/bookings/:id/checkin
// @access  Private (Staff/Admin)
const checkInGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const booking = await Booking.findOne({
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          { bookingReference: id },
        ],
      });

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      booking.bookingStatus = 'Checked In';
      booking.digitalKeyIssued = true;
      await booking.save();

      return res.json({
        success: true,
        message: `Guest ${booking.guestName} successfully checked into Suite ${booking.roomNumber}.`,
        data: booking,
      });
    } else {
      const booking = inMemoryBookings.find(
        (b) => b._id === id || b.bookingReference === id
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      booking.bookingStatus = 'Checked In';
      booking.digitalKeyIssued = true;

      return res.json({
        success: true,
        message: `Guest ${booking.guestName} successfully checked into Suite ${booking.roomNumber}.`,
        data: booking,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Express Check-Out
// @route   POST /api/bookings/:id/checkout
// @access  Private (Staff/Admin)
const checkOutGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const booking = await Booking.findOne({
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          { bookingReference: id },
        ],
      });

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      booking.bookingStatus = 'Checked Out';
      booking.digitalKeyIssued = false;
      await booking.save();

      // Trigger room housekeeping to 'Dirty'
      await Room.findOneAndUpdate(
        { roomNumber: booking.roomNumber },
        { status: 'Dirty', isAvailable: false }
      );

      return res.json({
        success: true,
        message: `Guest ${booking.guestName} checked out. Suite ${booking.roomNumber} queued for housekeeping.`,
        data: booking,
      });
    } else {
      const booking = inMemoryBookings.find(
        (b) => b._id === id || b.bookingReference === id
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      booking.bookingStatus = 'Checked Out';
      booking.digitalKeyIssued = false;

      // Update room in memory
      const room = inMemoryRooms.find((r) => r.roomNumber === booking.roomNumber);
      if (room) {
        room.status = 'Dirty';
        room.isAvailable = false;
      }

      return res.json({
        success: true,
        message: `Guest ${booking.guestName} checked out. Suite ${booking.roomNumber} queued for housekeeping.`,
        data: booking,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently active reservation for logged-in guest
// @route   GET /api/bookings/active/stay
// @access  Private
const getActiveStay = async (req, res) => {
  try {
    const activeBooking =
      inMemoryBookings.find(
        (b) => b.bookingStatus === 'Checked In' || b.bookingStatus === 'Confirmed'
      ) || inMemoryBookings[0];

    return res.json({ success: true, data: activeBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  checkInGuest,
  checkOutGuest,
  getActiveStay,
  inMemoryBookings,
};
