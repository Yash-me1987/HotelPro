import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomsReducer from './slices/roomsSlice';
import bookingsReducer from './slices/bookingsSlice';
import servicesReducer from './slices/servicesSlice';
import notificationsReducer from './slices/notificationsSlice';
import hotelReducer from './slices/hotelSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    bookings: bookingsReducer,
    services: servicesReducer,
    notifications: notificationsReducer,
    hotel: hotelReducer,
    theme: themeReducer
  }
});

export default store;
