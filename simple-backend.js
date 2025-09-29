const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://jeka7ro.github.io', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://admin:admin123@jeka7ro.gkyalir.mongodb.net/cashpot-v7?retryWrites=true&w=majority&appName=jeka7ro';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Simple User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple hardcoded users for testing
    if (username === 'admin' && password === 'admin123') {
      res.json({ 
        token: 'test-token-123',
        user: { 
          id: '1', 
          username: 'admin', 
          role: 'admin' 
        } 
      });
    } else if (username === 'test' && password === 'test123') {
      res.json({ 
        token: 'test-token-456',
        user: { 
          id: '2', 
          username: 'test', 
          role: 'user' 
        } 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple data routes
app.get('/api/companies', (req, res) => {
  res.json([
    { id: '1', name: 'Test Company 1', status: 'active' },
    { id: '2', name: 'Test Company 2', status: 'active' }
  ]);
});

app.get('/api/locations', (req, res) => {
  res.json([
    { id: '1', name: 'Test Location 1', status: 'active' },
    { id: '2', name: 'Test Location 2', status: 'active' }
  ]);
});

app.get('/api/providers', (req, res) => {
  res.json([
    { id: '1', name: 'Test Provider 1', status: 'active' },
    { id: '2', name: 'Test Provider 2', status: 'active' }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
