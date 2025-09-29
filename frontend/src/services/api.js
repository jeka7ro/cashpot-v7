// REAL API with MongoDB Atlas Backend

const API_BASE_URL = 'https://cashpot-v7-backend.onrender.com/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('cashpot_token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw { response: { status: response.status, data } };
    }
    
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Save companies to localStorage
const saveCompanies = (companies) => {
  localStorage.setItem('cashpot_companies', JSON.stringify(companies));
};

// Get next ID
const getNextId = () => {
  const companies = getCompanies();
  return Math.max(...companies.map(c => c.id), 0) + 1;
};

// Mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  login: async (username, password) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  logout: async () => {
    localStorage.removeItem('cashpot_token');
    return { data: { success: true } };
  },
  
  verify: async () => {
    return await apiCall('/auth/verify');
  },
  
  register: async (userData) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

export const companiesAPI = {
  list: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/companies?${queryString}` : '/companies';
    
    return await apiCall(endpoint);
  },
  
  get: async (id) => {
    return await apiCall(`/companies/${id}`);
  },
  
  create: async (data) => {
    return await apiCall('/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return await apiCall(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return await apiCall(`/companies/${id}`, {
      method: 'DELETE'
    });
  },
  
  bulkDelete: async (ids) => {
    return await apiCall('/companies/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  }
};

export const cabinetsAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  },
  get: async (id) => {
    await delay(200);
    return { data: { success: true, data: null } };
  },
  create: async (data) => {
    await delay(500);
    return { data: { success: true, data: data } };
  },
  update: async (id, data) => {
    await delay(400);
    return { data: { success: true, data: data } };
  },
  delete: async (id) => {
    await delay(300);
    return { data: { success: true } };
  },
  bulkDelete: async (ids) => {
    await delay(400);
    return { data: { success: true } };
  }
};

export const locationsAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  },
  create: async (data) => {
    await delay(500);
    return { data: { success: true, data: data } };
  }
};

export const providersAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  },
  create: async (data) => {
    await delay(500);
    return { data: { success: true, data: data } };
  }
};

export const gameMixesAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const slotsAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const warehouseAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const metrologyAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const jackpotsAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const invoicesAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const onjnReportsAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const legalDocumentsAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};

export const usersAPI = {
  list: async () => {
    await delay(300);
    return { data: { success: true, data: [] } };
  }
};