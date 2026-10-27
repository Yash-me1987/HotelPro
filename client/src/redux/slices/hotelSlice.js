import { createSlice } from '@reduxjs/toolkit';
import { initialHotelConfig, initialStaff, initialAuditLogs } from '../../data/initialData';

const initialState = {
  config: initialHotelConfig,
  staffList: initialStaff,
  auditLogs: initialAuditLogs,
  seasonalRules: [
    { id: 'rule-1', name: 'Summer High Surge', multiplier: 1.25, startDate: '2026-06-01', endDate: '2026-08-31', active: false },
    { id: 'rule-2', name: 'Autumn Prestige Festival', multiplier: 1.0, startDate: '2026-09-01', endDate: '2026-11-15', active: true },
    { id: 'rule-3', name: 'Winter Holiday Gala', multiplier: 1.35, startDate: '2026-12-15', endDate: '2027-01-05', active: false },
    { id: 'rule-4', name: 'Spring Blossom Saver', multiplier: 0.90, startDate: '2027-03-01', endDate: '2027-04-30', active: false }
  ]
};

export const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    updateHotelConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload };
    },
    addStaffMember: (state, action) => {
      const newStaff = {
        id: `staff-${Date.now()}`,
        status: 'Active',
        rating: 5.0,
        assignedTasks: 0,
        ...action.payload
      };
      state.staffList.push(newStaff);
    },
    updateStaffMember: (state, action) => {
      const { id, updates } = action.payload;
      const idx = state.staffList.findIndex(s => s.id === id);
      if (idx !== -1) {
        state.staffList[idx] = { ...state.staffList[idx], ...updates };
      }
    },
    deleteStaffMember: (state, action) => {
      state.staffList = state.staffList.filter(s => s.id !== action.payload);
    },
    toggleSeasonalRule: (state, action) => {
      const ruleId = action.payload;
      state.seasonalRules.forEach(r => {
        r.active = r.id === ruleId;
      });
      const activeRule = state.seasonalRules.find(r => r.id === ruleId);
      if (activeRule) {
        state.config.seasonalPricingMultiplier = activeRule.multiplier;
        state.config.seasonalCampaignName = activeRule.name;
      }
    },
    addAuditLog: (state, action) => {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ...action.payload
      });
    }
  }
});

export const {
  updateHotelConfig,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  toggleSeasonalRule,
  addAuditLog
} = hotelSlice.actions;

export default hotelSlice.reducer;
