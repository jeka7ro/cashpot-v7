const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const config = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cashpot-v7.abc123.mongodb.net/cashpot-v7?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'cashpot-v7-super-secret-key-2024'
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  createDefaultData();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️  Using mock data instead of MongoDB');
});

// Create default data
async function createDefaultData() {
  try {
    // Create default admin user
    const User = require('./models/User');
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        firstName: 'Administrator',
        lastName: 'Sistem',
        role: 'admin'
      });
      console.log('Default admin user created.');
    }

    // Create default companies
    const Company = require('./models/Company');
    const companiesCount = await Company.countDocuments();
    if (companiesCount === 0) {
      await Company.insertMany([
        {
          name: 'Casino Palace',
          license: 'LIC-001',
          address: 'Strada Principală 123, București',
          phone: '+40 21 123 4567',
          email: 'info@casinopalace.ro',
          status: 'active',
          contactPerson: 'Ion Popescu',
          notes: 'Companie principală',
          createdBy: 'admin'
        },
        {
          name: 'Gaming Center Max',
          license: 'LIC-002',
          address: 'Bd. Unirii 45, Cluj-Napoca',
          phone: '+40 264 987 654',
          email: 'contact@gamingmax.ro',
          status: 'active',
          contactPerson: 'Maria Ionescu',
          notes: 'Centru de gaming modern',
          createdBy: 'admin'
        },
        {
          name: 'TRADE INVEST NETWORKssa',
          license: 'LIC-003',
          address: 'str. Popa Savu 78, ap.3 Sector 1',
          phone: '0729030303',
          email: '2@2.com',
          status: 'active',
          contactPerson: 'Alexandru Popescu',
          notes: 'Retea de investitii',
          createdBy: 'admin'
        }
      ]);
      console.log('Default companies created.');
    }
  } catch (error) {
    console.error('Error creating default data:', error);
  }
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    version: '7.0.1', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const User = require('./models/User');
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    res.json({
      success: true,
      user: {
        id: decoded.id,
        username: 'admin',
        firstName: 'Administrator',
        lastName: 'Sistem',
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Middleware for protecting routes
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Company routes
app.get('/api/companies', authMiddleware, async (req, res) => {
  try {
    const Company = require('./models/Company');
    const { search, status, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { license: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Company.countDocuments(query);

    res.json({ 
      success: true, 
      data: companies, 
      pagination: { 
        current: parseInt(page), 
        pages: Math.ceil(total / limit), 
        total: total 
      } 
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Error fetching companies' });
  }
});

app.post('/api/companies', authMiddleware, async (req, res) => {
  try {
    const Company = require('./models/Company');
    const companyData = {
      ...req.body,
      createdBy: req.user.id
    };
    const newCompany = new Company(companyData);
    await newCompany.save();
    res.status(201).json({ success: true, data: newCompany, message: 'Company created successfully' });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/companies/:id', authMiddleware, async (req, res) => {
  try {
    const Company = require('./models/Company');
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ success: true, data: updatedCompany, message: 'Company updated successfully' });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/companies/:id', authMiddleware, async (req, res) => {
  try {
    const Company = require('./models/Company');
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: error.message });
  }
});

// File upload routes
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Backend running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`MongoDB URI: ${config.MONGODB_URI}`);
});