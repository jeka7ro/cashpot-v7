import { base44 } from './base44Client';
import { getGoogleSheetsData, convertSheetsDataToObjects, parseSlotMachineData, getUniqueLocations, getUniqueManufacturers, getUniqueGameMixes, getUniqueCabinets } from '../config/googleSheets.js';
import { apiRequest } from './auth.js';

// API base URL - Connected to backend on Render V7
const API_BASE_URL = 'https://cashpot-v7-backend.onrender.com/api';

// Fallback to localStorage
const getLocalStorageData = (endpoint) => {
  const key = endpoint.replace('/', '');
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};


// Company entity using ONLINE API for persistence
export const Company = {
  async list() {
    try {
      return await apiRequest('/companies');
    } catch (error) {
      console.error('Error fetching companies from API:', error);
      return getLocalStorageData('/companies');
    }
  },

  async create(companyData) {
    try {
      return await apiRequest('/companies', {
        method: 'POST',
        body: JSON.stringify(companyData)
      });
    } catch (error) {
      console.error('Error creating company via API:', error);
      // Fallback to localStorage
      const newCompany = {
        id: `comp-${Date.now()}`,
        ...companyData,
        created_date: new Date().toISOString(),
        status: 'active'
      };
      const localData = localStorage.getItem('companies');
      const localCompanies = localData ? JSON.parse(localData) : [];
      localCompanies.push(newCompany);
      localStorage.setItem('companies', JSON.stringify(localCompanies));
      return newCompany;
    }
  },

  async update(id, companyData) {
    try {
      return await apiRequest(`/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(companyData)
      });
    } catch (error) {
      console.error('Error updating company via API:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('companies');
      const localCompanies = localData ? JSON.parse(localData) : [];
      const index = localCompanies.findIndex(comp => comp.id === id);
      if (index !== -1) {
        localCompanies[index] = { ...localCompanies[index], ...companyData, updated_date: new Date().toISOString() };
        localStorage.setItem('companies', JSON.stringify(localCompanies));
        return localCompanies[index];
      }
      throw new Error('Company not found');
    }
  },

  async delete(id) {
    try {
      return await apiRequest(`/companies/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting company via API:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('companies');
      const localCompanies = localData ? JSON.parse(localData) : [];
      const index = localCompanies.findIndex(comp => comp.id === id);
      if (index !== -1) {
        localCompanies.splice(index, 1);
        localStorage.setItem('companies', JSON.stringify(localCompanies));
        return { success: true };
      }
      return { success: false };
    }
  },

  async get(id) {
    try {
      return await apiRequest(`/companies/${id}`);
    } catch (error) {
      console.error('Error fetching company via API:', error);
      const companies = await this.list();
      return companies.find(company => company.id === id) || null;
    }
  }
};

// Location entity using ONLINE API for persistence
export const Location = {
  async list() {
    try {
      return await apiRequest('/locations');
    } catch (error) {
      console.error('Error fetching locations from API:', error);
      return getLocalStorageData('/locations');
    }
  },

  async create(locationData) {
    try {
      return await apiRequest('/locations', {
        method: 'POST',
        body: JSON.stringify(locationData)
      });
    } catch (error) {
      console.error('Error creating location via API:', error);
      // Fallback to localStorage
      const newLocation = {
        id: `loc-${Date.now()}`,
        ...locationData,
        created_date: new Date().toISOString(),
        status: 'active'
      };
      const localData = localStorage.getItem('locations');
      const localLocations = localData ? JSON.parse(localData) : [];
      localLocations.push(newLocation);
      localStorage.setItem('locations', JSON.stringify(localLocations));
      return newLocation;
    }
  },

  async update(id, locationData) {
    try {
      return await apiRequest(`/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(locationData)
      });
    } catch (error) {
      console.error('Error updating location via API:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('locations');
      const localLocations = localData ? JSON.parse(localData) : [];
      const index = localLocations.findIndex(loc => loc.id === id);
      if (index !== -1) {
        localLocations[index] = { ...localLocations[index], ...locationData, updated_date: new Date().toISOString() };
        localStorage.setItem('locations', JSON.stringify(localLocations));
        return localLocations[index];
      }
      throw new Error('Location not found');
    }
  },

  async delete(id) {
    try {
      return await apiRequest(`/locations/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting location via API:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('locations');
      const localLocations = localData ? JSON.parse(localData) : [];
      const index = localLocations.findIndex(loc => loc.id === id);
      if (index !== -1) {
        localLocations.splice(index, 1);
        localStorage.setItem('locations', JSON.stringify(localLocations));
        return { success: true };
      }
      return { success: false };
    }
  },

  async get(id) {
    try {
      return await apiRequest(`/locations/${id}`);
    } catch (error) {
      console.error('Error fetching location via API:', error);
      const locations = await this.list();
      return locations.find(location => location.id === id) || null;
    }
  }
};

// Provider entity using ONLINE API for persistence
export const Provider = {
  async list() {
    try {
      return await apiRequest('/providers');
    } catch (error) {
      console.error('Error fetching providers from API:', error);
      return getLocalStorageData('/providers');
    }
  },

  async create(providerData) {
    try {
      return await apiRequest('/providers', {
        method: 'POST',
        body: JSON.stringify(providerData)
      });
    } catch (error) {
      console.error('Error creating provider via API:', error);
      // Fallback to localStorage
      const newProvider = {
        id: `prov-${Date.now()}`,
        ...providerData,
        created_date: new Date().toISOString(),
        status: 'active'
      };
      const localData = localStorage.getItem('providers');
      const localProviders = localData ? JSON.parse(localData) : [];
      localProviders.push(newProvider);
      localStorage.setItem('providers', JSON.stringify(localProviders));
      return newProvider;
    }
  },

  async update(id, providerData) {
    try {
      return await apiRequest(`/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(providerData)
      });
    } catch (error) {
      console.error('Error updating provider via API:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('providers');
      const localProviders = localData ? JSON.parse(localData) : [];
      const index = localProviders.findIndex(prov => prov.id === id);
      if (index !== -1) {
        localProviders[index] = { ...localProviders[index], ...providerData, updated_date: new Date().toISOString() };
        localStorage.setItem('providers', JSON.stringify(localProviders));
        return localProviders[index];
      }
      throw new Error('Provider not found');
    }
  },

  async delete(id) {
    try {
      return await apiRequest(`/providers/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting provider via API:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('providers');
      const localProviders = localData ? JSON.parse(localData) : [];
      const index = localProviders.findIndex(prov => prov.id === id);
      if (index !== -1) {
        localProviders.splice(index, 1);
        localStorage.setItem('providers', JSON.stringify(localProviders));
        return { success: true };
      }
      return { success: false };
    }
  },

  async get(id) {
    try {
      return await apiRequest(`/providers/${id}`);
    } catch (error) {
      console.error('Error fetching provider via API:', error);
      const providers = await this.list();
      return providers.find(provider => provider.id === id) || null;
    }
  }
};

// Cabinet entity combining Google Sheets data with localStorage
export const Cabinet = {
  async list() {
    try {
      console.log('Cabinet.list() called - combining Google Sheets with localStorage');
      // Get data from Google Sheets first
      const sheetData = await getGoogleSheetsData('SlotMachines!A:E');
      const slotMachines = parseSlotMachineData(sheetData);
      const googleCabinets = getUniqueCabinets(slotMachines);
      
      // Get data from localStorage
      const localData = localStorage.getItem('cabinets');
      const localCabinets = localData ? JSON.parse(localData) : [];
      
      // Combine both sources, with local data taking precedence
      const allCabinets = [...googleCabinets];
      
      // Override with localStorage data (local changes take precedence)
      localCabinets.forEach(localCab => {
        const existingIndex = allCabinets.findIndex(cab => cab.name === localCab.name);
        if (existingIndex !== -1) {
          allCabinets[existingIndex] = localCab;
        } else {
          allCabinets.push(localCab);
        }
      });
      
      console.log(`Loaded ${googleCabinets.length} cabinets from Google Sheets and ${localCabinets.length} from localStorage`);
      return allCabinets;
    } catch (error) {
      console.error('Error fetching cabinets:', error);
      const localData = localStorage.getItem('cabinets');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async create(cabinetData) {
    console.log('Cabinet.create() called with:', cabinetData);
    const newCabinet = {
      id: `cab-${Date.now()}`,
      ...cabinetData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    // Save to localStorage
    const localData = localStorage.getItem('cabinets');
    const localCabinets = localData ? JSON.parse(localData) : [];
    localCabinets.push(newCabinet);
    localStorage.setItem('cabinets', JSON.stringify(localCabinets));
    
    return newCabinet;
  },

  async update(id, cabinetData) {
    console.log('Cabinet.update() called for ID:', id, 'with:', cabinetData);
    const updatedCabinet = {
      id,
      ...cabinetData,
      updated_date: new Date().toISOString()
    };
    
    // Update in localStorage
    const localData = localStorage.getItem('cabinets');
    const localCabinets = localData ? JSON.parse(localData) : [];
    const index = localCabinets.findIndex(cab => cab.id === id);
    if (index !== -1) {
      localCabinets[index] = updatedCabinet;
      localStorage.setItem('cabinets', JSON.stringify(localCabinets));
    }
    
    return updatedCabinet;
  },

  async delete(id) {
    console.log('Cabinet.delete() called for ID:', id);
    const localData = localStorage.getItem('cabinets');
    const localCabinets = localData ? JSON.parse(localData) : [];
    const index = localCabinets.findIndex(cab => cab.id === id);
    if (index !== -1) {
      localCabinets.splice(index, 1);
      localStorage.setItem('cabinets', JSON.stringify(localCabinets));
      return { success: true };
    }
    return { success: false };
  },

  async get(id) {
    console.log('Cabinet.get() called for ID:', id);
    const cabinets = await this.list();
    return cabinets.find(cabinet => cabinet.id === id) || null;
  }
};

// GameMix entity using localStorage for persistence
export const GameMix = {
  async list() {
    try {
      // Get data from Google Sheets first
      const sheetData = await getGoogleSheetsData('SlotMachines!A:E');
      const slotMachines = parseSlotMachineData(sheetData);
      const googleGameMixes = getUniqueGameMixes(slotMachines);
      
      // Get data from localStorage
      const localData = localStorage.getItem('gameMixes');
      const localGameMixes = localData ? JSON.parse(localData) : [];
      
      // Combine both sources, with local data taking precedence
      // First add Google Sheets data, then override with localStorage data
      const allGameMixes = [...googleGameMixes];
      
      // Override with localStorage data (local changes take precedence)
      localGameMixes.forEach(localMix => {
        const existingIndex = allGameMixes.findIndex(mix => mix.name === localMix.name);
        if (existingIndex !== -1) {
          // Replace existing Google Sheets data with local data
          allGameMixes[existingIndex] = localMix;
        } else {
          // Add new local data
          allGameMixes.push(localMix);
        }
      });
      
      console.log(`Loaded ${googleGameMixes.length} game mixes from Google Sheets and ${localGameMixes.length} from localStorage`);
      console.log('Final game mixes:', allGameMixes.map(mix => ({ name: mix.name, id: mix.id, games: mix.games?.length || 0 })));
      return allGameMixes;
    } catch (error) {
      console.error('Error fetching game mixes:', error);
      // Fallback to localStorage only
      const localData = localStorage.getItem('gameMixes');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async create(gameMixData) {
    console.log('GameMix.create() called with:', gameMixData);
    const newGameMix = {
      id: `mix-${Date.now()}`,
      ...gameMixData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    // Save to localStorage
    const localData = localStorage.getItem('gameMixes');
    const localGameMixes = localData ? JSON.parse(localData) : [];
    localGameMixes.push(newGameMix);
    localStorage.setItem('gameMixes', JSON.stringify(localGameMixes));
    
    return newGameMix;
  },

  async update(id, gameMixData) {
    console.log('GameMix.update() called for ID:', id, 'with:', gameMixData);
    const updatedGameMix = {
      id,
      ...gameMixData,
      updated_date: new Date().toISOString()
    };
    
    // Update in localStorage
    const localData = localStorage.getItem('gameMixes');
    const localGameMixes = localData ? JSON.parse(localData) : [];
    
    // Try to find by ID first
    let index = localGameMixes.findIndex(mix => mix.id === id);
    
    // If not found by ID, try to find by name (for Google Sheets data)
    if (index === -1) {
      index = localGameMixes.findIndex(mix => mix.name === gameMixData.name);
    }
    
    if (index !== -1) {
      localGameMixes[index] = updatedGameMix;
      localStorage.setItem('gameMixes', JSON.stringify(localGameMixes));
      console.log('GameMix updated in localStorage:', updatedGameMix);
    } else {
      // If not found, add it as new
      localGameMixes.push(updatedGameMix);
      localStorage.setItem('gameMixes', JSON.stringify(localGameMixes));
      console.log('GameMix added to localStorage:', updatedGameMix);
    }
    
    return updatedGameMix;
  },

  async delete(id) {
    console.log('GameMix.delete() called for ID:', id);
    const localData = localStorage.getItem('gameMixes');
    const localGameMixes = localData ? JSON.parse(localData) : [];
    const filteredGameMixes = localGameMixes.filter(mix => mix.id !== id);
    localStorage.setItem('gameMixes', JSON.stringify(filteredGameMixes));
    return { success: true };
  },

  async get(id) {
    console.log('GameMix.get() called for ID:', id);
    const gameMixes = await this.list();
    return gameMixes.find(mix => mix.id === id) || null;
  }
};

// SlotMachine entity combining Google Sheets data with localStorage
export const SlotMachine = {
  async list() {
    try {
      console.log('SlotMachine.list() called - combining Google Sheets with localStorage');
      // Get data from Google Sheets first
      const sheetData = await getGoogleSheetsData('SlotMachines!A:E');
      const googleSlots = parseSlotMachineData(sheetData);
      
      // Get data from localStorage
      const localData = localStorage.getItem('slotMachines');
      const localSlots = localData ? JSON.parse(localData) : [];
      
      // Combine both sources, with local data taking precedence
      const allSlots = [...googleSlots];
      
      // Override with localStorage data (local changes take precedence)
      localSlots.forEach(localSlot => {
        const existingIndex = allSlots.findIndex(slot => slot.serial_number === localSlot.serial_number);
        if (existingIndex !== -1) {
          // Replace existing Google Sheets data with local data
          allSlots[existingIndex] = localSlot;
        } else {
          // Add new local data
          allSlots.push(localSlot);
        }
      });
      
      console.log(`Loaded ${googleSlots.length} slots from Google Sheets and ${localSlots.length} from localStorage`);
      return allSlots;
    } catch (error) {
      console.error('Error fetching slot machines:', error);
      // Fallback to localStorage only
      const localData = localStorage.getItem('slotMachines');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async create(slotData) {
    console.log('SlotMachine.create() called with:', slotData);
    const newSlot = {
      id: `slot-${Date.now()}`,
      ...slotData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    // Save to localStorage
    const localData = localStorage.getItem('slotMachines');
    const localSlots = localData ? JSON.parse(localData) : [];
    localSlots.push(newSlot);
    localStorage.setItem('slotMachines', JSON.stringify(localSlots));
    
    return newSlot;
  },

  async update(id, slotData) {
    console.log('SlotMachine.update() called for ID:', id, 'with:', slotData);
    const updatedSlot = {
      id,
      ...slotData,
      updated_date: new Date().toISOString()
    };
    
    // Update in localStorage
    const localData = localStorage.getItem('slotMachines');
    const localSlots = localData ? JSON.parse(localData) : [];
    const index = localSlots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      localSlots[index] = updatedSlot;
      localStorage.setItem('slotMachines', JSON.stringify(localSlots));
    }
    
    return updatedSlot;
  },

  async delete(id) {
    console.log('SlotMachine.delete() called for ID:', id);
    const localData = localStorage.getItem('slotMachines');
    const localSlots = localData ? JSON.parse(localData) : [];
    const index = localSlots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      localSlots.splice(index, 1);
      localStorage.setItem('slotMachines', JSON.stringify(localSlots));
      return { success: true };
    }
    return { success: false };
  },

  async get(id) {
    console.log('SlotMachine.get() called for ID:', id);
    const slots = await this.list();
    return slots.find(slot => slot.id === id) || null;
  }
};

// User entity with real data
export const User = {
  async list() {
    const key = 'users';
    const local = localStorage.getItem(key);
    if (local) {
      return JSON.parse(local);
    }
    const seed = [
      { id: '1', username: 'admin', email: 'admin@base44.com', first_name: 'Admin', last_name: 'User', role: 'admin', is_active: true, avatar: '' },
      { id: '2', username: 'manager', email: 'manager@base44.com', first_name: 'Manager', last_name: 'User', role: 'manager', is_active: true, avatar: '' },
      { id: '3', username: 'operator', email: 'operator@base44.com', first_name: 'Operator', last_name: 'User', role: 'operator', is_active: true, avatar: '' }
    ];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  },

  async create(userData) {
    const key = 'users';
    const users = await this.list();
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      created_date: new Date().toISOString(),
      is_active: userData.is_active !== false
    };
    users.push(newUser);
    localStorage.setItem(key, JSON.stringify(users));
    return newUser;
  },

  async update(id, userData) {
    const key = 'users';
    const users = await this.list();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    const updated = { ...users[idx], ...userData, updated_date: new Date().toISOString() };
    users[idx] = updated;
    localStorage.setItem(key, JSON.stringify(users));
    return updated;
  },

  async get(id) {
    const users = await this.list();
    return users.find(user => user.id === id) || null;
  }
};

// Mock entities for other collections
const getInvoices = () => {
  // Get existing invoices from localStorage
  const existingInvoices = localStorage.getItem('invoices');
  if (existingInvoices) {
    return JSON.parse(existingInvoices);
  }
  
  // Return test invoice if no invoices exist
  const testInvoices = [
    {
      id: "test-134862",
      invoice_number: "INV-TEST-134862",
      serial_number: "134862",
      amount: 5000,
      status: "paid",
      created_date: new Date().toISOString(),
      attachments: [
        {
          name: "invoice-134862.pdf",
          type: "application/pdf",
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        }
      ]
    },
    {
      id: "test-134863",
      invoice_number: "INV-TEST-134863",
      serial_number: "134863",
      amount: 7500,
      status: "pending",
      created_date: new Date().toISOString(),
      attachments: [
        {
          name: "sample-invoice.pdf",
          type: "application/pdf",
          url: "https://www.africau.edu/images/default/sample.pdf"
        }
      ]
    },
    {
      id: "test-134864",
      invoice_number: "INV-TEST-134864",
      serial_number: "134864",
      amount: 3000,
      status: "paid",
      created_date: new Date().toISOString(),
      attachments: [
        {
          name: "invoice-134862.pdf",
          type: "application/pdf",
          url: "/public/invoice-134862.pdf"
        }
      ]
    }
  ];
  
  // Save test invoices to localStorage
  localStorage.setItem('invoices', JSON.stringify(testInvoices));
  return testInvoices;
};

const saveInvoices = (invoices) => {
  try {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Clear old data and try again - but preserve metrology
      console.warn('localStorage quota exceeded, clearing old data...');
      const metrologyData = localStorage.getItem('metrology');
      localStorage.removeItem('invoices');
      localStorage.setItem('invoices', JSON.stringify(invoices));
      // Restore metrology data
      if (metrologyData) {
        localStorage.setItem('metrology', metrologyData);
      }
    } else {
      throw error;
    }
  }
};

export const Invoice = {
  async list() {
    return getInvoices();
  },

  async create(invoiceData) {
    console.log('Invoice.create() called with:', invoiceData);
    const invoices = getInvoices();
    const newInvoice = {
      id: `inv-${Date.now()}`,
      ...invoiceData,
      created_date: new Date().toISOString(),
      status: 'pending'
    };
    invoices.push(newInvoice);
    saveInvoices(invoices);
    console.log('New invoice saved:', newInvoice);
    return newInvoice;
  },

  async update(id, invoiceData) {
    console.log('Invoice.update() called for ID:', id, 'with:', invoiceData);
    const invoices = getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices[index] = {
        ...invoices[index],
        ...invoiceData,
        updated_date: new Date().toISOString()
      };
      saveInvoices(invoices);
      return invoices[index];
    }
    return null;
  },

  async delete(id) {
    console.log('Invoice.delete() called for ID:', id);
    const invoices = getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices.splice(index, 1);
      saveInvoices(invoices);
      return { success: true };
    }
    return { success: false };
  },

  async get(id) {
    console.log('Invoice.get() called for ID:', id);
    const invoices = getInvoices();
    return invoices.find(invoice => invoice.id === id) || null;
  }
};

const getMetrology = () => {
  // Get existing metrology from localStorage
  const existingMetrology = localStorage.getItem('metrology');
  if (existingMetrology) {
    return JSON.parse(existingMetrology);
  }
  
  // Return empty array if no metrology exists
  return [];
};

const saveMetrology = (metrology) => {
  try {
    localStorage.setItem('metrology', JSON.stringify(metrology));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Clear old data and try again - but preserve invoices
      console.warn('localStorage quota exceeded, clearing old data...');
      const invoicesData = localStorage.getItem('invoices');
      localStorage.removeItem('metrology');
      localStorage.setItem('metrology', JSON.stringify(metrology));
      // Restore invoices data
      if (invoicesData) {
        localStorage.setItem('invoices', invoicesData);
      }
    } else {
      throw error;
    }
  }
};

export const Metrology = {
  async list() {
    const metrology = getMetrology();
    console.log('Metrology.list() called, returning', metrology.length, 'records');
    return metrology;
  },

  async create(metrologyData) {
    console.log('Metrology.create() called with:', metrologyData);
    const metrology = getMetrology();
    const newMetrology = {
      id: `metrology-${Date.now()}`,
      ...metrologyData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    metrology.push(newMetrology);
    saveMetrology(metrology);
    console.log('New metrology saved:', newMetrology);
    console.log('Total metrology records:', metrology.length);
    return newMetrology;
  },

  async update(id, metrologyData) {
    console.log('Metrology.update() called for ID:', id, 'with:', metrologyData);
    const metrology = getMetrology();
    const index = metrology.findIndex(m => m.id === id);
    if (index !== -1) {
      metrology[index] = {
        ...metrology[index],
        ...metrologyData,
        updated_date: new Date().toISOString()
      };
      saveMetrology(metrology);
      return metrology[index];
    }
    return null;
  },

  async delete(id) {
    console.log('Metrology.delete() called for ID:', id);
    const metrology = getMetrology();
    const index = metrology.findIndex(m => m.id === id);
    if (index !== -1) {
      metrology.splice(index, 1);
      saveMetrology(metrology);
      return { success: true };
    }
    return { success: false };
  },

  async get(id) {
    console.log('Metrology.get() called for ID:', id);
    const metrology = getMetrology();
    return metrology.find(m => m.id === id) || null;
  }
};

export const Platform = {
  async list() {
    try {
      // Get data from localStorage
      const localData = localStorage.getItem('platforms');
      if (localData) {
        const platforms = JSON.parse(localData);
        console.log(`Loaded ${platforms.length} platforms from localStorage`);
        return platforms;
      }
      
      // If no data in localStorage, initialize with default data
      const defaultPlatforms = [
        { id: '1', name: 'Windows', description: 'Microsoft Windows platform', provider_id: 'provider-1', status: 'active', created_date: '2024-01-01T00:00:00.000Z' },
        { id: '2', name: 'Linux', description: 'Linux operating system', provider_id: 'provider-2', status: 'active', created_date: '2024-01-01T00:00:00.000Z' },
        { id: '3', name: 'Android', description: 'Google Android platform', provider_id: 'provider-3', status: 'active', created_date: '2024-01-01T00:00:00.000Z' },
        { id: '4', name: 'iOS', description: 'Apple iOS platform', provider_id: 'provider-4', status: 'active', created_date: '2024-01-01T00:00:00.000Z' },
        { id: '5', name: 'Web', description: 'Web browser platform', provider_id: 'provider-5', status: 'active', created_date: '2024-01-01T00:00:00.000Z' },
        { id: '6', name: 'Console', description: 'Gaming console platform', provider_id: 'provider-6', status: 'active', created_date: '2024-01-01T00:00:00.000Z' }
      ];
      
      // Save default data to localStorage
      localStorage.setItem('platforms', JSON.stringify(defaultPlatforms));
      console.log(`Initialized with ${defaultPlatforms.length} default platforms`);
      return defaultPlatforms;
    } catch (error) {
      console.error('Error loading platforms:', error);
      return [];
    }
  },

  async create(platformData) {
    console.log('Platform.create() called with:', platformData);
    
    // Get existing platforms to generate next ID
    const localData = localStorage.getItem('platforms');
    const platforms = localData ? JSON.parse(localData) : [];
    
    // Generate next numeric ID
    const maxId = platforms.length > 0 ? Math.max(...platforms.map(p => parseInt(p.id) || 0)) : 0;
    const nextId = (maxId + 1).toString();
    
    const newPlatform = {
      id: nextId,
      ...platformData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    platforms.push(newPlatform);
    localStorage.setItem('platforms', JSON.stringify(platforms));
    
    return newPlatform;
  },

  async update(id, platformData) {
    console.log('Platform.update() called for ID:', id, 'with:', platformData);
    const updatedPlatform = {
      id,
      ...platformData,
      updated_date: new Date().toISOString()
    };
    
    // Update in localStorage
    const localData = localStorage.getItem('platforms');
    const platforms = localData ? JSON.parse(localData) : [];
    const index = platforms.findIndex(p => p.id === id);
    if (index !== -1) {
      platforms[index] = updatedPlatform;
      localStorage.setItem('platforms', JSON.stringify(platforms));
      return updatedPlatform;
    }
    return null;
  },

  async delete(id) {
    console.log('Platform.delete() called for ID:', id);
    const localData = localStorage.getItem('platforms');
    const platforms = localData ? JSON.parse(localData) : [];
    const filteredPlatforms = platforms.filter(p => p.id !== id);
    localStorage.setItem('platforms', JSON.stringify(filteredPlatforms));
    return { success: true };
  },

  async get(id) {
    console.log('Platform.get() called for ID:', id);
    const platforms = await this.list();
    return platforms.find(platform => platform.id === id) || null;
  }
};

export const Jackpot = {
  async list() {
    return [
      { id: '1', name: 'Mega Jackpot', amount: 100000, status: 'active', created_date: '2024-01-01' },
      { id: '2', name: 'Super Jackpot', amount: 50000, status: 'active', created_date: '2024-01-02' },
      { id: '3', name: 'Grand Jackpot', amount: 25000, status: 'active', created_date: '2024-01-03' },
      { id: '4', name: 'Major Jackpot', amount: 10000, status: 'active', created_date: '2024-01-04' },
      { id: '5', name: 'Minor Jackpot', amount: 5000, status: 'active', created_date: '2024-01-05' },
      { id: '6', name: 'Mini Jackpot', amount: 1000, status: 'active', created_date: '2024-01-06' },
      { id: '7', name: 'Micro Jackpot', amount: 500, status: 'active', created_date: '2024-01-07' },
      { id: '8', name: 'Nano Jackpot', amount: 100, status: 'active', created_date: '2024-01-08' },
      { id: '9', name: 'Pico Jackpot', amount: 50, status: 'active', created_date: '2024-01-09' }
    ];
  }
};

// Metrology Approvals entity
export const MetrologyApproval = {
  async list() {
    console.log('MetrologyApproval.list() called - using localStorage only');
    const localData = localStorage.getItem('metrologyApprovals');
    const localApprovals = localData ? JSON.parse(localData) : [];
    console.log(`Loaded ${localApprovals.length} metrology approvals from localStorage`);
    return localApprovals;
  },

  async create(approvalData) {
    console.log('MetrologyApproval.create() called with:', approvalData);
    const newApproval = {
      id: `approval-${Date.now()}`,
      type: 'approval',
      ...approvalData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    const localData = localStorage.getItem('metrologyApprovals');
    const localApprovals = localData ? JSON.parse(localData) : [];
    localApprovals.push(newApproval);
    localStorage.setItem('metrologyApprovals', JSON.stringify(localApprovals));
    
    console.log('MetrologyApproval saved to localStorage:', newApproval);
    return newApproval;
  },

  async update(id, approvalData) {
    console.log('MetrologyApproval.update() called for ID:', id, 'with:', approvalData);
    const updatedApproval = {
      id,
      type: 'approval',
      ...approvalData,
      updated_date: new Date().toISOString()
    };
    
    const localData = localStorage.getItem('metrologyApprovals');
    const localApprovals = localData ? JSON.parse(localData) : [];
    const index = localApprovals.findIndex(approval => approval.id === id);
    if (index !== -1) {
      localApprovals[index] = updatedApproval;
      localStorage.setItem('metrologyApprovals', JSON.stringify(localApprovals));
    }
    
    return updatedApproval;
  },

  async delete(id) {
    console.log('MetrologyApproval.delete() called for ID:', id);
    const localData = localStorage.getItem('metrologyApprovals');
    const localApprovals = localData ? JSON.parse(localData) : [];
    const filteredApprovals = localApprovals.filter(approval => approval.id !== id);
    localStorage.setItem('metrologyApprovals', JSON.stringify(filteredApprovals));
    return { success: true };
  }
};

// Metrology Commission entity
export const MetrologyCommission = {
  async list() {
    console.log('MetrologyCommission.list() called - using localStorage only');
    const localData = localStorage.getItem('metrologyCommissions');
    const localCommissions = localData ? JSON.parse(localData) : [];
    console.log(`Loaded ${localCommissions.length} metrology commissions from localStorage`);
    return localCommissions;
  },

  async create(commissionData) {
    console.log('MetrologyCommission.create() called with:', commissionData);
    const newCommission = {
      id: `commission-${Date.now()}`,
      type: 'commission',
      ...commissionData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    const localData = localStorage.getItem('metrologyCommissions');
    const localCommissions = localData ? JSON.parse(localData) : [];
    localCommissions.push(newCommission);
    localStorage.setItem('metrologyCommissions', JSON.stringify(localCommissions));
    
    console.log('MetrologyCommission saved to localStorage:', newCommission);
    return newCommission;
  },

  async update(id, commissionData) {
    console.log('MetrologyCommission.update() called for ID:', id, 'with:', commissionData);
    const updatedCommission = {
      id,
      type: 'commission',
      ...commissionData,
      updated_date: new Date().toISOString()
    };
    
    const localData = localStorage.getItem('metrologyCommissions');
    const localCommissions = localData ? JSON.parse(localData) : [];
    const index = localCommissions.findIndex(commission => commission.id === id);
    if (index !== -1) {
      localCommissions[index] = updatedCommission;
      localStorage.setItem('metrologyCommissions', JSON.stringify(localCommissions));
    }
    
    return updatedCommission;
  },

  async delete(id) {
    console.log('MetrologyCommission.delete() called for ID:', id);
    const localData = localStorage.getItem('metrologyCommissions');
    const localCommissions = localData ? JSON.parse(localData) : [];
    const filteredCommissions = localCommissions.filter(commission => commission.id !== id);
    localStorage.setItem('metrologyCommissions', JSON.stringify(filteredCommissions));
    return { success: true };
  }
};

// Metrology Authority entity
export const MetrologyAuthority = {
  async list() {
    console.log('MetrologyAuthority.list() called - using localStorage only');
    const localData = localStorage.getItem('metrologyAuthorities');
    const localAuthorities = localData ? JSON.parse(localData) : [];
    console.log(`Loaded ${localAuthorities.length} metrology authorities from localStorage`);
    return localAuthorities;
  },

  async create(authorityData) {
    console.log('MetrologyAuthority.create() called with:', authorityData);
    const newAuthority = {
      id: `authority-${Date.now()}`,
      type: 'authority',
      ...authorityData,
      created_date: new Date().toISOString(),
      status: 'active'
    };
    
    const localData = localStorage.getItem('metrologyAuthorities');
    const localAuthorities = localData ? JSON.parse(localData) : [];
    localAuthorities.push(newAuthority);
    localStorage.setItem('metrologyAuthorities', JSON.stringify(localAuthorities));
    
    console.log('MetrologyAuthority saved to localStorage:', newAuthority);
    return newAuthority;
  },

  async update(id, authorityData) {
    console.log('MetrologyAuthority.update() called for ID:', id, 'with:', authorityData);
    const updatedAuthority = {
      id,
      type: 'authority',
      ...authorityData,
      updated_date: new Date().toISOString()
    };
    
    const localData = localStorage.getItem('metrologyAuthorities');
    const localAuthorities = localData ? JSON.parse(localData) : [];
    const index = localAuthorities.findIndex(authority => authority.id === id);
    if (index !== -1) {
      localAuthorities[index] = updatedAuthority;
      localStorage.setItem('metrologyAuthorities', JSON.stringify(localAuthorities));
    }
    
    return updatedAuthority;
  },

  async delete(id) {
    console.log('MetrologyAuthority.delete() called for ID:', id);
    const localData = localStorage.getItem('metrologyAuthorities');
    const localAuthorities = localData ? JSON.parse(localData) : [];
    const filteredAuthorities = localAuthorities.filter(authority => authority.id !== id);
    localStorage.setItem('metrologyAuthorities', JSON.stringify(filteredAuthorities));
    return { success: true };
  }
};

// Helper function to get commission data for a slot based on serial number
const getCommissionForSlot = async (serialNumber) => {
  try {
    const localData = localStorage.getItem('metrologyCommissions');
    const commissions = localData ? JSON.parse(localData) : [];
    
    // Find commission that contains this serial number
    const commission = commissions.find(comm => {
      if (!comm.serial_numbers || !Array.isArray(comm.serial_numbers)) {
        return false;
      }
      
      // Convert both to strings for comparison
      const serialStr = String(serialNumber);
      return comm.serial_numbers.some(sn => String(sn) === serialStr);
    });
    
    return commission || null;
  } catch (error) {
    console.error('Error getting commission for slot:', error);
    return null;
  }
};

// MetrologySoftware entity
export const MetrologySoftware = {
  async list() {
    console.log('MetrologySoftware.list() called');
    const localData = localStorage.getItem('metrologySoftware');
    const localSoftware = localData ? JSON.parse(localData) : [];
    return localSoftware;
  },

  async create(data) {
    console.log('MetrologySoftware.create() called with data:', data);
    const localData = localStorage.getItem('metrologySoftware');
    const localSoftware = localData ? JSON.parse(localData) : [];
    const newSoftware = {
      id: `software-${Date.now()}`,
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    localSoftware.push(newSoftware);
    localStorage.setItem('metrologySoftware', JSON.stringify(localSoftware));
    return { success: true, data: newSoftware };
  },

  async update(id, data) {
    console.log('MetrologySoftware.update() called for ID:', id, 'with data:', data);
    const localData = localStorage.getItem('metrologySoftware');
    const localSoftware = localData ? JSON.parse(localData) : [];
    const index = localSoftware.findIndex(software => software.id === id);
    if (index !== -1) {
      localSoftware[index] = {
        ...localSoftware[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('metrologySoftware', JSON.stringify(localSoftware));
      return { success: true, data: localSoftware[index] };
    }
    return { success: false, error: 'Software not found' };
  },

  async delete(id) {
    console.log('MetrologySoftware.delete() called for ID:', id);
    const localData = localStorage.getItem('metrologySoftware');
    const localSoftware = localData ? JSON.parse(localData) : [];
    const filteredSoftware = localSoftware.filter(software => software.id !== id);
    localStorage.setItem('metrologySoftware', JSON.stringify(filteredSoftware));
    return { success: true };
  }
};

// Export the helper function
export { getCommissionForSlot };

