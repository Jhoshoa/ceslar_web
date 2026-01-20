import api from './api';

/**
 * Admin API endpoints for CRUD operations
 * These endpoints require admin authentication
 */

// Dashboard statistics
export const dashboardApi = {
  getStats: () => api.get('/admin/stats'),
  getRecentActivity: () => api.get('/admin/activity'),
};

// Churches Admin API
export const adminChurchesApi = {
  getAll: (params) => api.get('/churches', { params }),
  getById: (id) => api.get(`/churches/${id}`),
  create: (data) => api.post('/churches', data),
  update: (id, data) => api.put(`/churches/${id}`, data),
  delete: (id) => api.delete(`/churches/${id}`),
  uploadLogo: (id, formData) => api.post(`/churches/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCover: (id, formData) => api.post(`/churches/${id}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, status) => api.patch(`/churches/${id}/status`, { status }),
};

// Events Admin API
export const adminEventsApi = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  uploadImage: (id, formData) => api.post(`/events/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getRegistrations: (id, params) => api.get(`/events/${id}/registrations`, { params }),
  cancelEvent: (id) => api.patch(`/events/${id}/cancel`),
};

// Sermons Admin API
export const adminSermonsApi = {
  getAll: (params) => api.get('/sermons', { params }),
  getById: (id) => api.get(`/sermons/${id}`),
  create: (data) => api.post('/sermons', data),
  update: (id, data) => api.put(`/sermons/${id}`, data),
  delete: (id) => api.delete(`/sermons/${id}`),
  uploadThumbnail: (id, formData) => api.post(`/sermons/${id}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadAudio: (id, formData) => api.post(`/sermons/${id}/audio`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getSeries: () => api.get('/sermons/series'),
  getTags: () => api.get('/sermons/tags'),
};

// Ministries Admin API
export const adminMinistriesApi = {
  getAll: (params) => api.get('/ministries', { params }),
  getById: (id) => api.get(`/ministries/${id}`),
  create: (data) => api.post('/ministries', data),
  update: (id, data) => api.put(`/ministries/${id}`, data),
  delete: (id) => api.delete(`/ministries/${id}`),
  uploadImage: (id, formData) => api.post(`/ministries/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMembers: (id, params) => api.get(`/ministries/${id}/members`, { params }),
  addMember: (id, userId) => api.post(`/ministries/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/ministries/${id}/members/${userId}`),
  updateMemberRole: (id, userId, role) => api.put(`/ministries/${id}/members/${userId}`, { role }),
};

// Questions Admin API
export const adminQuestionsApi = {
  // Categories
  getCategories: () => api.get('/questions/categories'),
  createCategory: (data) => api.post('/questions/categories', data),
  updateCategory: (id, data) => api.put(`/questions/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/questions/categories/${id}`),
  reorderCategories: (orders) => api.put('/questions/categories/reorder', { orders }),

  // Questions
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  reorder: (orders) => api.put('/questions/reorder', { orders }),
  getStats: (id) => api.get(`/questions/${id}/stats`),
  getAnswers: (id, params) => api.get(`/questions/${id}/answers`, { params }),
};

// Users Admin API
export const adminUsersApi = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getAnswers: (id) => api.get(`/questions/registration/users/${id}/answers`),
  getMemberships: (id) => api.get(`/users/${id}/memberships`),
};

// Countries API (External)
export const countriesApi = {
  getAll: async () => {
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,cca2,region,subregion'
      );
      const data = await response.json();
      return data
        .map(country => ({
          code: country.cca2,
          name: country.name.common,
          region: country.region,
          subregion: country.subregion,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },
  getSouthAmerican: async () => {
    const countries = await countriesApi.getAll();
    return countries.filter(c => c.subregion === 'South America');
  },
};

export default {
  dashboard: dashboardApi,
  churches: adminChurchesApi,
  events: adminEventsApi,
  sermons: adminSermonsApi,
  ministries: adminMinistriesApi,
  questions: adminQuestionsApi,
  users: adminUsersApi,
  countries: countriesApi,
};
