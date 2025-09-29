const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'password') {
    res.json({
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
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  res.json({
    user: {
      id: 1,
      username: 'admin',
      firstName: 'Administrator',
      lastName: 'Sistem',
      role: 'admin'
    }
  });
});

// Data routes
app.get('/api/companies', (req, res) => {
  res.json({ success: true, data: companies });
});

app.get('/api/locations', (req, res) => {
  res.json({ success: true, data: locations });
});

app.get('/api/providers', (req, res) => {
  res.json({ success: true, data: providers });
});

app.get('/api/cabinets', (req, res) => {
  res.json({ success: true, data: cabinets });
});

app.get('/api/game-mixes', (req, res) => {
  res.json({ success: true, data: gameMixes });
});

app.get('/api/slots', (req, res) => {
  res.json({ success: true, data: slots });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    version: '7.0.1',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Cashpot V7 Backend running on port ${PORT}`);
});
