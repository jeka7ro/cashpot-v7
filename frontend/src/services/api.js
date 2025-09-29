import axios from 'axios';

const API_BASE_URL = 'https://cashpot-v7-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
  register: (userData) => api.post('/auth/register', userData),
};

export const companiesAPI = {
  list: (params) => api.get('/companies', { params }),
  get: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
  bulkDelete: (ids) => api.post('/companies/bulk-delete', { ids }),
};

export const cabinetsAPI = {
  list: (params) => api.get('/cabinets', { params }),
  get: (id) => api.get(`/cabinets/${id}`),
  create: (data) => api.post('/cabinets', data),
  update: (id, data) => api.put(`/cabinets/${id}`, data),
  delete: (id) => api.delete(`/cabinets/${id}`),
  bulkDelete: (ids) => api.post('/cabinets/bulk-delete', { ids }),
};

export const locationsAPI = {
  list: () => api.get('/locations'),
  create: (data) => api.post('/locations', data),
};

export const providersAPI = {
  list: () => api.get('/providers'),
  create: (data) => api.post('/providers', data),
};

export const gameMixesAPI = {
  list: () => api.get('/game-mixes'),
};

export const slotsAPI = {
  list: () => api.get('/slots'),
};

export const warehouseAPI = {
  list: () => api.get('/warehouse'),
};

export const metrologyAPI = {
  list: () => api.get('/metrology'),
};

export const jackpotsAPI = {
  list: () => api.get('/jackpots'),
};

export const invoicesAPI = {
  list: () => api.get('/invoices'),
};

export const onjnReportsAPI = {
  list: () => api.get('/onjn-reports'),
};

export const legalDocumentsAPI = {
  list: () => api.get('/legal-documents'),
};

export const usersAPI = {
  list: () => api.get('/users'),
};

export default api;
