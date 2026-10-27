import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialRooms } from '../../data/initialData';
import { roomsAPI } from '../../services/api';

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (_, { rejectWithValue }) => {
  try {
    const res = await roomsAPI.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const syncRoomStatus = createAsyncThunk('rooms/syncRoomStatus', async ({ roomId, status }, { rejectWithValue }) => {
  try {
    const res = await roomsAPI.updateStatus(roomId, status);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  rooms: initialRooms,
  loading: false,
  error: null,
  selectedCategory: 'All',
  searchTerm: '',
  priceRange: [150, 2500],
  selectedFloor: 'All',
  selectedStatus: 'All',
  sortBy: 'recommended',
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    updateRoomStatus: (state, action) => {
      const { roomId, status } = action.payload;
      const room = state.rooms.find((r) => r.id === roomId || r.roomNumber === roomId);
      if (room) {
        room.status = status;
        room.isAvailable = status !== 'Out of Order';
      }
    },
    updateRoomPrice: (state, action) => {
      const { roomId, newPrice } = action.payload;
      const room = state.rooms.find((r) => r.id === roomId || r.roomNumber === roomId);
      if (room) {
        room.price = Number(newPrice);
        room.basePrice = Number(newPrice);
      }
    },
    applySeasonalPricingToRooms: (state, action) => {
      const multiplier = action.payload;
      state.rooms.forEach((room) => {
        room.price = Math.round(room.basePrice * multiplier);
      });
    },
    addRoom: (state, action) => {
      const newRoom = {
        id: `room-${Date.now()}`,
        status: 'Clean',
        isAvailable: true,
        rating: 5.0,
        reviewsCount: 1,
        seasonalDiscount: 0,
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        ...action.payload,
      };
      state.rooms.push(newRoom);
    },
    updateRoomDetails: (state, action) => {
      const { id, updates } = action.payload;
      const idx = state.rooms.findIndex((r) => r.id === id || r.roomNumber === id);
      if (idx !== -1) {
        state.rooms[idx] = { ...state.rooms[idx], ...updates };
      }
    },
    deleteRoom: (state, action) => {
      state.rooms = state.rooms.filter((r) => r.id !== action.payload && r.roomNumber !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          // Merge API rooms preserving id references
          state.rooms = action.payload.map((r, i) => ({
            id: r.roomNumber || `room-${i}`,
            ...r,
          }));
        }
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSearchTerm,
  setPriceRange,
  setSortBy,
  updateRoomStatus,
  updateRoomPrice,
  applySeasonalPricingToRooms,
  addRoom,
  updateRoomDetails,
  deleteRoom,
} = roomsSlice.actions;

export default roomsSlice.reducer;
