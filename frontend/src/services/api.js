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

// Churches API
export const churchesApi = {
  getAll: (params) => api.get('/churches', { params }),
  getById: (id) => api.get(`/churches/${id}`),
  getBySlug: (slug) => api.get(`/churches/slug/${slug}`),
  getHeadquarters: () => api.get('/churches/headquarters'),
  getGrouped: () => api.get('/churches/grouped'),
  getCountries: () => api.get('/churches/countries'),
  getDepartments: (country) => api.get(`/churches/countries/${encodeURIComponent(country)}/departments`),
  getCities: (country, department) => api.get(`/churches/countries/${encodeURIComponent(country)}/departments/${encodeURIComponent(department)}/cities`),
  getByCountry: (country) => api.get(`/churches/country/${encodeURIComponent(country)}`),
  getNearby: (lat, lng, maxDistance = 50) => api.get('/churches/nearby', { params: { lat, lng, maxDistance } }),
  getHierarchy: (id) => api.get(`/churches/${id}/hierarchy`),
  getChildren: (id) => api.get(`/churches/${id}/children`),
};

// Membership API
export const membershipApi = {
  // User membership actions
  requestMembership: (churchId, message) => api.post('/memberships/request', { churchId, message }),
  getMyMemberships: () => api.get('/memberships/my'),
  leaveChurch: (churchId) => api.delete(`/memberships/churches/${churchId}/leave`),

  // Church admin actions
  getPendingRequests: (churchId, params) => api.get(`/memberships/churches/${churchId}/pending`, { params }),
  approveMembership: (churchId, userId, role) => api.put(`/memberships/churches/${churchId}/approve/${userId}`, { role }),
  rejectMembership: (churchId, userId, reason) => api.put(`/memberships/churches/${churchId}/reject/${userId}`, { reason }),
  getChurchMembers: (churchId, params) => api.get(`/memberships/churches/${churchId}/members`, { params }),
  updateMemberRole: (churchId, userId, role) => api.put(`/memberships/churches/${churchId}/members/${userId}/role`, { role }),
  removeMember: (churchId, userId) => api.delete(`/memberships/churches/${churchId}/members/${userId}`),

  // Leadership
  getLeadership: (churchId) => api.get(`/memberships/churches/${churchId}/leadership`),
  addLeader: (churchId, data) => api.post(`/memberships/churches/${churchId}/leadership`, data),
  removeLeader: (churchId, userId) => api.delete(`/memberships/churches/${churchId}/leadership/${userId}`),
};

// Questions/Questionnaire API
export const questionsApi = {
  // Public
  getRegistrationQuestions: (churchId, userType) =>
    api.get('/questions/registration', { params: { churchId, userType } }),
  getCategories: () => api.get('/questions/categories'),

  // User actions
  submitAnswers: (answers, churchId) => api.post('/questions/registration/submit', { answers, churchId }),
  getMyAnswers: () => api.get('/questions/registration/my-answers'),

  // Admin - Categories
  createCategory: (data) => api.post('/questions/categories', data),
  updateCategory: (categoryId, data) => api.put(`/questions/categories/${categoryId}`, data),
  deleteCategory: (categoryId) => api.delete(`/questions/categories/${categoryId}`),
  reorderCategories: (orders) => api.put('/questions/categories/reorder', { orders }),

  // Admin - Questions
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  reorder: (orders) => api.put('/questions/reorder', { orders }),
  getStats: (id) => api.get(`/questions/${id}/stats`),
  getAnswers: (id, params) => api.get(`/questions/${id}/answers`, { params }),
  getUserAnswers: (userId) => api.get(`/questions/registration/users/${userId}/answers`),
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
