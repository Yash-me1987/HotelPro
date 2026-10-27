import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'dark' // 'dark' | 'light' - dark feels ultra-luxurious for HotelPro!
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      document.documentElement.setAttribute('data-theme', action.payload);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
