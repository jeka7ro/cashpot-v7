const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cashpot:admin123@cashpot-v7.abc123.mongodb.net/cashpot-v7?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'cashpot-v7-super-secret-key-2024';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Company Schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  license: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  contactPerson: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Company = mongoose.model('Company', companySchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  createDefaultAdmin();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️  Using fallback data');
});

// Create default admin user
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        firstName: 'Administrator',
        lastName: 'Sistem',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: payload.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/logout', auth, (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

// Companies routes
app.get('/api/companies', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
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
        total
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/companies/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/companies', auth, async (req, res) => {
  try {
    const { name, license, address, phone, email, status, contactPerson, notes } = req.body;
    
    if (!name || !license || !address || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const company = new Company({
      name,
      license,
      address,
      phone,
      email,
      status: status || 'active',
      contactPerson: contactPerson || '',
      notes: notes || ''
    });
    
    await company.save();

    res.status(201).json({
      success: true,
      data: company,
      message: 'Company created successfully'
    });
  } catch (error) {
    console.error('Create company error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'License already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/companies/:id', auth, async (req, res) => {
  try {
    const { name, license, address, phone, email, status, contactPerson, notes } = req.body;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name: name || company.name,
        license: license || company.license,
        address: address || company.address,
        phone: phone || company.phone,
        email: email || company.email,
        status: status || company.status,
        contactPerson: contactPerson !== undefined ? contactPerson : company.contactPerson,
        notes: notes !== undefined ? notes : company.notes
      },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      data: company,
      message: 'Company updated successfully'
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/companies/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/companies/bulk-delete', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    const result = await Company.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} companies deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete companies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cashpot V7 Backend is running',
    timestamp: new Date().toISOString(),
    version: '7.0.1',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Cashpot V7 Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: admin / admin123`);
});

module.exports = app;