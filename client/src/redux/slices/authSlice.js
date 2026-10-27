import { createSlice } from '@reduxjs/toolkit';
import { initialUsers } from '../../data/initialData';

// Default active user is Lord Johnathan Vance (Guest)
// The user can switch roles freely between Guest, Staff, and Admin for live testing
const initialState = {
  currentUser: initialUsers[0], // Guest
  usersList: initialUsers,
  isAuthenticated: true,
  role: 'guest', // 'guest' | 'staff' | 'admin'
  demoProfiles: {
    guest: initialUsers[0],
    staff: initialUsers[3], // Sarah Jenkins
    admin: initialUsers[5]  // Alexander Wright
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    switchRole: (state, action) => {
      const targetRole = action.payload; // 'guest' | 'staff' | 'admin'
      state.role = targetRole;
      state.currentUser = state.demoProfiles[targetRole] || state.currentUser;
      state.isAuthenticated = true;
    },
    login: (state, action) => {
      const { email, role = 'guest' } = action.payload;
      const found = state.usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        state.currentUser = found;
        state.role = found.role;
      } else {
        const newUser = {
          id: `user-${Date.now()}`,
          name: action.payload.name || email.split('@')[0],
          email: email,
          role: role,
          status: 'Active',
          joined: new Date().toISOString().split('T')[0],
          bookingsCount: 0
        };
        state.usersList.push(newUser);
        state.currentUser = newUser;
        state.role = role;
      }
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    updateProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        // Update in usersList too
        const idx = state.usersList.findIndex(u => u.id === state.currentUser.id);
        if (idx !== -1) {
          state.usersList[idx] = { ...state.usersList[idx], ...action.payload };
        }
      }
    },
    addUser: (state, action) => {
      state.usersList.push({
        id: `user-${Date.now()}`,
        status: 'Active',
        joined: new Date().toISOString().split('T')[0],
        bookingsCount: 0,
        ...action.payload
      });
    },
    toggleUserStatus: (state, action) => {
      const user = state.usersList.find(u => u.id === action.payload);
      if (user) {
        user.status = user.status === 'Active' ? 'Suspended' : 'Active';
      }
    },
    changeUserRole: (state, action) => {
      const { userId, newRole } = action.payload;
      const user = state.usersList.find(u => u.id === userId);
      if (user) {
        user.role = newRole;
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser.role = newRole;
          state.role = newRole;
        }
      }
    }
  }
});

export const { switchRole, login, logout, updateProfile, addUser, toggleUserStatus, changeUserRole } = authSlice.actions;
export default authSlice.reducer;
