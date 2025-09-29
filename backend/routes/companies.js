const express = require('express');
const router = express.Router();

// Mock companies data
let companies = [
  {
    id: 1,
    name: 'Casino Palace',
    license: 'LIC-001',
    address: 'Strada Principală 123, București',
    phone: '+40 21 123 4567',
    email: 'info@casinopalace.ro',
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 2,
    name: 'Gaming Center Max',
    license: 'LIC-002',
    address: 'Bd. Unirii 45, Cluj-Napoca',
    phone: '+40 264 987 654',
    email: 'contact@gamingmax.ro',
    status: 'active',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 3,
    name: 'Lucky Slots',
    license: 'LIC-003',
    address: 'Calea Victoriei 78, Timișoara',
    phone: '+40 256 555 123',
    email: 'hello@luckyslots.ro',
    status: 'inactive',
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03')
  }
];

// Get all companies
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    let filteredCompanies = companies;
    
    // Filter by search
    if (search) {
      filteredCompanies = filteredCompanies.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.license.toLowerCase().includes(search.toLowerCase()) ||
        company.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by status
    if (status) {
      filteredCompanies = filteredCompanies.filter(company => company.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedCompanies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCompanies.length / limit),
        totalItems: filteredCompanies.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get company by ID
router.get('/:id', (req, res) => {
  try {
    const company = companies.find(c => c.id === parseInt(req.params.id));
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ success: true, data: company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new company
router.post('/', (req, res) => {
  try {
    const { name, license, address, phone, email, status = 'active' } = req.body;
    
    if (!name || !license || !address || !phone || !email) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    // Check if license already exists
    const existingCompany = companies.find(c => c.license === license);
    if (existingCompany) {
      return res.status(400).json({ error: 'Company with this license already exists' });
    }
    
    const newCompany = {
      id: companies.length + 1,
      name,
      license,
      address,
      phone,
      email,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    companies.push(newCompany);
    
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: newCompany
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update company
router.put('/:id', (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
    const companyIndex = companies.findIndex(c => c.id === companyId);
    
    if (companyIndex === -1) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    const { name, license, address, phone, email, status } = req.body;
    
    // Check if license already exists (excluding current company)
    if (license) {
      const existingCompany = companies.find(c => c.license === license && c.id !== companyId);
      if (existingCompany) {
        return res.status(400).json({ error: 'Company with this license already exists' });
      }
    }
    
    // Update company
    companies[companyIndex] = {
      ...companies[companyIndex],
      ...(name && { name }),
      ...(license && { license }),
      ...(address && { address }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(status && { status }),
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      message: 'Company updated successfully',
      data: companies[companyIndex]
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete company
router.delete('/:id', (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
    const companyIndex = companies.findIndex(c => c.id === companyId);
    
    if (companyIndex === -1) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    companies.splice(companyIndex, 1);
    
    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk operations
router.post('/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    
    const deletedCount = companies.filter(c => ids.includes(c.id)).length;
    companies = companies.filter(c => !ids.includes(c.id));
    
    res.json({
      success: true,
      message: `${deletedCount} companies deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
