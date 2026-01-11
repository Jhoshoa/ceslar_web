import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Public API endpoints
export const publicApi = {
  getHomepageData: () => api.get('/public/homepage'),
  getChurchInfo: () => api.get('/public/church-info'),
  submitContactForm: (data) => api.post('/public/contact', data),
  submitPrayerRequest: (data) => api.post('/public/prayer-request', data),
  subscribeNewsletter: (data) => api.post('/public/newsletter', data),
};

// Events API
export const eventsApi = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getBySlug: (slug) => api.get(`/events/slug/${slug}`),
  getUpcoming: (limit = 5) => api.get('/events/upcoming', { params: { limit } }),
  getFeatured: () => api.get('/events/featured'),
  register: (id) => api.post(`/events/${id}/register`),
  cancelRegistration: (id) => api.delete(`/events/${id}/register`),
};

// Sermons API
export const sermonsApi = {
  getAll: (params) => api.get('/sermons', { params }),
  getById: (id) => api.get(`/sermons/${id}`),
  getBySlug: (slug) => api.get(`/sermons/slug/${slug}`),
  getLatest: () => api.get('/sermons/latest'),
  getFeatured: (limit = 3) => api.get('/sermons/featured', { params: { limit } }),
  getSeries: () => api.get('/sermons/series'),
  getTags: () => api.get('/sermons/tags'),
};

// Ministries API
export const ministriesApi = {
  getAll: (params) => api.get('/ministries', { params }),
  getById: (id) => api.get(`/ministries/${id}`),
  getBySlug: (slug) => api.get(`/ministries/slug/${slug}`),
  getFeatured: () => api.get('/ministries/featured'),
  join: (id) => api.post(`/ministries/${id}/join`),
  leave: (id) => api.delete(`/ministries/${id}/leave`),
};

// Users API
export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  syncUser: (data) => api.post('/users/sync', data),
  getDirectory: (params) => api.get('/users/directory', { params }),
};

// Set auth token (called after Auth0 login)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
