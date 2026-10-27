import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialBookings } from '../../data/initialData';
import { bookingsAPI } from '../../services/api';

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const res = await bookingsAPI.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const submitBooking = createAsyncThunk('bookings/submitBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const res = await bookingsAPI.create(bookingData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  bookings: initialBookings,
  loading: false,
  error: null,
  currentBookingFlow: {
    room: null,
    checkIn: '',
    checkOut: '',
    nights: 1,
    guests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
    addOns: [],
    totalAmount: 0,
    paymentMethod: 'Stripe',
  },
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    startBooking: (state, action) => {
      state.currentBookingFlow = {
        ...state.currentBookingFlow,
        ...action.payload,
      };
    },
    updateBookingFlow: (state, action) => {
      state.currentBookingFlow = {
        ...state.currentBookingFlow,
        ...action.payload,
      };
    },
    resetBookingFlow: (state) => {
      state.currentBookingFlow = {
        room: null,
        checkIn: '',
        checkOut: '',
        nights: 1,
        guests: 2,
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        specialRequests: '',
        addOns: [],
        totalAmount: 0,
        paymentMethod: 'Stripe',
      };
    },
    createBooking: (state, action) => {
      const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.bookings.unshift(newBooking);
    },
    cancelBooking: (state, action) => {
      const { bookingId, reason } = action.payload;
      const booking = state.bookings.find(
        (b) => b.id === bookingId || b.bookingReference === bookingId
      );
      if (booking) {
        booking.bookingStatus = 'Cancelled';
        booking.paymentStatus = 'Refunded';
        booking.cancellationReason = reason || 'Guest requested cancellation';
      }
    },
    checkInBooking: (state, action) => {
      const booking = state.bookings.find(
        (b) => b.id === action.payload || b.bookingReference === action.payload
      );
      if (booking) {
        booking.bookingStatus = 'Checked-In';
      }
    },
    checkOutBooking: (state, action) => {
      const booking = state.bookings.find(
        (b) => b.id === action.payload || b.bookingReference === action.payload
      );
      if (booking) {
        booking.bookingStatus = 'Checked-Out';
      }
    },
    updateBookingDetails: (state, action) => {
      const { id, updates } = action.payload;
      const idx = state.bookings.findIndex(
        (b) => b.id === id || b.bookingReference === id
      );
      if (idx !== -1) {
        state.bookings[idx] = { ...state.bookings[idx], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.bookings = action.payload.map((b) => ({
            id: b.bookingReference || b._id,
            ...b,
          }));
        }
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        if (action.payload) {
          state.bookings.unshift({
            id: action.payload.bookingReference || action.payload._id,
            ...action.payload,
          });
        }
      });
  },
});

export const {
  startBooking,
  updateBookingFlow,
  resetBookingFlow,
  createBooking,
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  updateBookingDetails,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
