// Mock data
const companies = [
  { id: 1, name: 'Casino Palace', license: 'LIC-001', address: 'Strada Principală 123, București', phone: '+40 21 123 4567', email: 'info@casinopalace.ro', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Gaming Center Max', license: 'LIC-002', address: 'Bd. Unirii 45, Cluj-Napoca', phone: '+40 264 987 654', email: 'contact@gamingmax.ro', status: 'active', createdAt: new Date() }
];

const locations = [
  { id: 1, name: 'Main Floor', address: 'Ground Level', status: 'active', createdAt: new Date() },
  { id: 2, name: 'VIP Area', address: 'First Floor', status: 'active', createdAt: new Date() }
];

const providers = [
  { id: 1, name: 'Unknown Provider', contact: 'N/A', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Gaming Solutions Ltd', contact: 'contact@gaming.ro', status: 'active', createdAt: new Date() }
];

const cabinets = [
  { id: 1, name: 'Alfastreet Live CAB001', provider: 'Unknown Provider', status: 'active', location: 'Main Floor', gameMix: 'Classic Slots', createdAt: new Date() },
  { id: 2, name: 'VIP 27/2x42 CAB002', provider: 'Unknown Provider', status: 'active', location: 'VIP Area', gameMix: 'Premium Games', createdAt: new Date() },
  { id: 3, name: 'P42V Curved ST CAB003', provider: 'Unknown Provider', status: 'active', location: 'Gaming Zone A', gameMix: 'Modern Slots', createdAt: new Date() },
  { id: 4, name: 'P42V Curved UP CAB004', provider: 'Unknown Provider', status: 'active', location: 'Gaming Zone B', gameMix: 'Modern Slots', createdAt: new Date() },
  { id: 5, name: 'G 55" C VIP CAB005', provider: 'Unknown Provider', status: 'active', location: 'VIP Lounge', gameMix: 'Exclusive Games', createdAt: new Date() }
];

const gameMixes = [
  { id: 1, name: 'Classic Slots', description: 'Traditional slot games', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Premium Games', description: 'High-end gaming experience', status: 'active', createdAt: new Date() }
];

const slots = Array.from({ length: 310 }, (_, i) => ({
  id: i + 1,
  name: `Slot ${i + 1}`,
  type: 'Video Slot',
  status: 'active',
  createdAt: new Date()
}));

// Mock API functions
const mockAPI = (data) => Promise.resolve({ data: { success: true, data } });

export const authAPI = {
  login: (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      return Promise.resolve({
        data: {
          success: true,
          message: 'Login successful',
          token: 'mock-jwt-token',
          user: {
            id: 1,
            username: 'admin',
            firstName: 'Administrator',
            lastName: 'Sistem',
            role: 'admin'
          }
        }
      });
    } else {
      return Promise.reject({ response: { status: 401, data: { error: 'Invalid credentials' } } });
    }
  },
  logout: () => Promise.resolve({ data: { success: true } }),
  verify: () => Promise.resolve({
    data: {
      user: {
        id: 1,
        username: 'admin',
        firstName: 'Administrator',
        lastName: 'Sistem',
        role: 'admin'
      }
    }
  }),
  register: (userData) => Promise.resolve({ data: { success: true, user: userData } }),
};

export const companiesAPI = {
  list: () => mockAPI(companies),
  get: (id) => mockAPI(companies.find(c => c.id === id)),
  create: (data) => mockAPI({ ...data, id: companies.length + 1 }),
  update: (id, data) => mockAPI({ ...data, id }),
  delete: (id) => mockAPI({ success: true }),
  bulkDelete: (ids) => mockAPI({ success: true }),
};

export const cabinetsAPI = {
  list: () => mockAPI(cabinets),
  get: (id) => mockAPI(cabinets.find(c => c.id === id)),
  create: (data) => mockAPI({ ...data, id: cabinets.length + 1 }),
  update: (id, data) => mockAPI({ ...data, id }),
  delete: (id) => mockAPI({ success: true }),
  bulkDelete: (ids) => mockAPI({ success: true }),
};

export const locationsAPI = {
  list: () => mockAPI(locations),
  create: (data) => mockAPI({ ...data, id: locations.length + 1 }),
};

export const providersAPI = {
  list: () => mockAPI(providers),
  create: (data) => mockAPI({ ...data, id: providers.length + 1 }),
};

export const gameMixesAPI = {
  list: () => mockAPI(gameMixes),
};

export const slotsAPI = {
  list: () => mockAPI(slots),
};

export const warehouseAPI = {
  list: () => mockAPI([]),
};

export const metrologyAPI = {
  list: () => mockAPI([]),
};

export const jackpotsAPI = {
  list: () => mockAPI([]),
};

export const invoicesAPI = {
  list: () => mockAPI([]),
};

export const onjnReportsAPI = {
  list: () => mockAPI([]),
};

export const legalDocumentsAPI = {
  list: () => mockAPI([]),
};

export const usersAPI = {
  list: () => mockAPI([]),
};
