// WORKING API with localStorage - NO BACKEND NEEDED!

// Get companies from localStorage
const getCompanies = () => {
  const stored = localStorage.getItem('cashpot_companies');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default companies
  const defaultCompanies = [
    {
      id: 1,
      name: 'Casino Palace',
      license: 'LIC-001',
      address: 'Strada Principală 123, București',
      phone: '+40 21 123 4567',
      email: 'info@casinopalace.ro',
      status: 'active',
      contactPerson: 'Ion Popescu',
      notes: 'Companie principală',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Gaming Center Max',
      license: 'LIC-002',
      address: 'Bd. Unirii 45, Cluj-Napoca',
      phone: '+40 264 987 654',
      email: 'contact@gamingmax.ro',
      status: 'active',
      contactPerson: 'Maria Ionescu',
      notes: 'Centru de gaming modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('cashpot_companies', JSON.stringify(defaultCompanies));
  return defaultCompanies;
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
    await delay(500); // Simulate network delay
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('cashpot_token', 'working-token-12345');
      return {
        data: {
          success: true,
          message: 'Login successful',
          token: 'working-token-12345',
          user: {
            id: 1,
            username: 'admin',
            firstName: 'Administrator',
            lastName: 'Sistem',
            role: 'admin'
          }
        }
      };
    } else {
      throw { response: { status: 401, data: { error: 'Invalid credentials' } } };
    }
  },
  
  logout: async () => {
    await delay(200);
    localStorage.removeItem('cashpot_token');
    return { data: { success: true } };
  },
  
  verify: async () => {
    await delay(200);
    const token = localStorage.getItem('cashpot_token');
    if (token === 'working-token-12345') {
      return {
        data: {
          success: true,
          user: {
            id: 1,
            username: 'admin',
            firstName: 'Administrator',
            lastName: 'Sistem',
            role: 'admin'
          }
        }
      };
    } else {
      throw { response: { status: 401, data: { error: 'Invalid token' } } };
    }
  },
  
  register: async (userData) => {
    await delay(500);
    return { data: { success: true, user: userData } };
  }
};

export const companiesAPI = {
  list: async (params = {}) => {
    await delay(300);
    let companies = getCompanies();
    
    // Apply search filter
    if (params.search) {
      const search = params.search.toLowerCase();
      companies = companies.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.license.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (params.status) {
      companies = companies.filter(c => c.status === params.status);
    }
    
    return {
      data: {
        success: true,
        data: companies,
        pagination: {
          current: 1,
          pages: 1,
          total: companies.length
        }
      }
    };
  },
  
  get: async (id) => {
    await delay(200);
    const companies = getCompanies();
    const company = companies.find(c => c.id == id);
    if (!company) {
      throw { response: { status: 404, data: { error: 'Company not found' } } };
    }
    return { data: { success: true, data: company } };
  },
  
  create: async (data) => {
    await delay(500);
    const companies = getCompanies();
    
    // Check if license exists
    if (companies.find(c => c.license === data.license)) {
      throw { response: { status: 400, data: { error: 'License already exists' } } };
    }
    
    const newCompany = {
      id: getNextId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    companies.push(newCompany);
    saveCompanies(companies);
    
    return {
      data: {
        success: true,
        data: newCompany,
        message: 'Company created successfully'
      }
    };
  },
  
  update: async (id, data) => {
    await delay(400);
    const companies = getCompanies();
    const index = companies.findIndex(c => c.id == id);
    
    if (index === -1) {
      throw { response: { status: 404, data: { error: 'Company not found' } } };
    }
    
    // Check if license exists (excluding current company)
    if (data.license && companies.find(c => c.license === data.license && c.id != id)) {
      throw { response: { status: 400, data: { error: 'License already exists' } } };
    }
    
    companies[index] = {
      ...companies[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    saveCompanies(companies);
    
    return {
      data: {
        success: true,
        data: companies[index],
        message: 'Company updated successfully'
      }
    };
  },
  
  delete: async (id) => {
    await delay(300);
    const companies = getCompanies();
    const index = companies.findIndex(c => c.id == id);
    
    if (index === -1) {
      throw { response: { status: 404, data: { error: 'Company not found' } } };
    }
    
    companies.splice(index, 1);
    saveCompanies(companies);
    
    return {
      data: {
        success: true,
        message: 'Company deleted successfully'
      }
    };
  },
  
  bulkDelete: async (ids) => {
    await delay(400);
    const companies = getCompanies();
    const initialLength = companies.length;
    
    const filteredCompanies = companies.filter(c => !ids.includes(c.id));
    saveCompanies(filteredCompanies);
    
    const deletedCount = initialLength - filteredCompanies.length;
    
    return {
      data: {
        success: true,
        message: `${deletedCount} companies deleted successfully`
      }
    };
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