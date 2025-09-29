// Authentication API for Cashpot V7
const API_BASE_URL = 'https://cashpot-v7-backend.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};

// Generic API request with authentication
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        removeAuthToken();
        throw new Error('Authentication required');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API
export const Auth = {
  async login(username, password) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (response.token) {
        setAuthToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.token) {
        setAuthToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiRequest('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    removeAuthToken();
  },

  isAuthenticated() {
    return !!getAuthToken();
  },

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export { apiRequest, getAuthToken, setAuthToken, removeAuthToken };
