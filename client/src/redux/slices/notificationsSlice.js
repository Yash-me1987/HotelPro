import { createSlice } from '@reduxjs/toolkit';
import { initialNotifications } from '../../data/initialData';

const initialState = {
  notifications: initialNotifications
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        time: 'Just now',
        read: false,
        type: 'system',
        ...action.payload
      });
    },
    markAsRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
