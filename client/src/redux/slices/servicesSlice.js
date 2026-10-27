import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialServices } from '../../data/initialData';
import { servicesAPI } from '../../services/api';

export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { rejectWithValue }) => {
  try {
    const res = await servicesAPI.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const submitServiceRequest = createAsyncThunk(
  'services/submitServiceRequest',
  async (serviceData, { rejectWithValue }) => {
    try {
      const res = await servicesAPI.create(serviceData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  services: initialServices,
  loading: false,
};

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    addServiceRequest: (state, action) => {
      const newService = {
        id: `srv-${Date.now().toString().slice(-4)}`,
        status: 'Pending',
        timeRequested: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'Normal',
        ...action.payload,
      };
      state.services.unshift(newService);
    },
    updateServiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const srv = state.services.find((s) => s.id === id || s._id === id);
      if (srv) {
        srv.status = status;
      }
    },
    assignStaffToService: (state, action) => {
      const { id, staffName } = action.payload;
      const srv = state.services.find((s) => s.id === id || s._id === id);
      if (srv) {
        srv.assignedTo = staffName;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.services = action.payload.map((s) => ({
            id: s._id || `srv-${s.roomNumber}`,
            ...s,
          }));
        }
      })
      .addCase(submitServiceRequest.fulfilled, (state, action) => {
        if (action.payload) {
          state.services.unshift({
            id: action.payload._id,
            ...action.payload,
          });
        }
      });
  },
});

export const { addServiceRequest, updateServiceStatus, assignStaffToService } =
  servicesSlice.actions;
export default servicesSlice.reducer;
