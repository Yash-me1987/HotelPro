import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotelpro_token') || 'demo-jwt-token-guest';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'API Communication error';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const roomsAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (roomData) => api.post('/rooms', roomData),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, { status }),
  updatePricing: (multiplier, roomType) => api.patch('/rooms/pricing/multiplier', { multiplier, roomType }),
  getAvailabilityMatrix: () => api.get('/rooms/availability/matrix'),
};

export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
  checkIn: (id) => api.post(`/bookings/${id}/checkin`),
  checkOut: (id) => api.post(`/bookings/${id}/checkout`),
  getActiveStay: () => api.get('/bookings/active/stay'),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  create: (serviceData) => api.post('/services', serviceData),
  updateStatus: (id, status, assignedTo) => api.patch(`/services/${id}/status`, { status, assignedTo }),
};

export const reviewsAPI = {
  getForRoom: (roomId) => api.get('/reviews', { params: { roomId } }),
  create: (reviewData) => api.post('/reviews', reviewData),
};

export const paymentsAPI = {
  createPaymentIntent: (paymentData) => api.post('/payments/create-payment-intent', paymentData),
  verify: (paymentIntentId) => api.post('/payments/verify', { paymentIntentId }),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  getConfig: () => api.get('/admin/config'),
  updateConfig: (configData) => api.put('/admin/config', configData),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
