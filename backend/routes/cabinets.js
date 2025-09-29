const express = require('express');
const router = express.Router();

// Mock cabinets data
let cabinets = [
  {
    id: 1,
    name: 'Alfastreet Live CAB001',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Main Floor',
    gameMix: 'Classic Slots',
    createdAt: new Date('2025-09-29'),
    updatedAt: new Date('2025-09-29')
  },
  {
    id: 2,
    name: 'VIP 27/2x42 CAB002',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'VIP Area',
    gameMix: 'Premium Games',
    createdAt: new Date('2025-09-29'),
    updatedAt: new Date('2025-09-29')
  },
  {
    id: 3,
    name: 'P42V Curved ST CAB003',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone A',
    gameMix: 'Modern Slots',
    createdAt: new Date('2025-09-29'),
    updatedAt: new Date('2025-09-29')
  },
  {
    id: 4,
    name: 'P42V Curved UP CAB004',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone B',
    gameMix: 'Modern Slots',
    createdAt: new Date('2025-09-29'),
    updatedAt: new Date('2025-09-29')
  },
  {
    id: 5,
    name: 'G 55" C VIP CAB005',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'VIP Lounge',
    gameMix: 'Exclusive Games',
    createdAt: new Date('2025-09-29'),
    updatedAt: new Date('2025-09-29')
  },
  {
    id: 6,
    name: 'Standard CAB006',
    provider: 'Unknown Provider',
    status: 'maintenance',
    location: 'Main Floor',
    gameMix: 'Classic Slots',
    createdAt: new Date('2025-09-28'),
    updatedAt: new Date('2025-09-29')
  },
  {
    id: 7,
    name: 'Premium CAB007',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone C',
    gameMix: 'Premium Games',
    createdAt: new Date('2025-09-28'),
    updatedAt: new Date('2025-09-28')
  },
  {
    id: 8,
    name: 'Deluxe CAB008',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'VIP Area',
    gameMix: 'Exclusive Games',
    createdAt: new Date('2025-09-27'),
    updatedAt: new Date('2025-09-27')
  },
  {
    id: 9,
    name: 'Compact CAB009',
    provider: 'Unknown Provider',
    status: 'inactive',
    location: 'Storage',
    gameMix: 'Classic Slots',
    createdAt: new Date('2025-09-26'),
    updatedAt: new Date('2025-09-26')
  },
  {
    id: 10,
    name: 'Ultra CAB010',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone D',
    gameMix: 'Modern Slots',
    createdAt: new Date('2025-09-25'),
    updatedAt: new Date('2025-09-25')
  },
  {
    id: 11,
    name: 'Mega CAB011',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Main Floor',
    gameMix: 'Premium Games',
    createdAt: new Date('2025-09-24'),
    updatedAt: new Date('2025-09-24')
  },
  {
    id: 12,
    name: 'Pro CAB012',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone A',
    gameMix: 'Modern Slots',
    createdAt: new Date('2025-09-23'),
    updatedAt: new Date('2025-09-23')
  },
  {
    id: 13,
    name: 'Elite CAB013',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'VIP Lounge',
    gameMix: 'Exclusive Games',
    createdAt: new Date('2025-09-22'),
    updatedAt: new Date('2025-09-22')
  },
  {
    id: 14,
    name: 'Master CAB014',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone B',
    gameMix: 'Premium Games',
    createdAt: new Date('2025-09-21'),
    updatedAt: new Date('2025-09-21')
  },
  {
    id: 15,
    name: 'Supreme CAB015',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Main Floor',
    gameMix: 'Classic Slots',
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    id: 16,
    name: 'Ultimate CAB016',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone C',
    gameMix: 'Modern Slots',
    createdAt: new Date('2025-09-19'),
    updatedAt: new Date('2025-09-19')
  },
  {
    id: 17,
    name: 'Champion CAB017',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'VIP Area',
    gameMix: 'Exclusive Games',
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-18')
  },
  {
    id: 18,
    name: 'Legend CAB018',
    provider: 'Unknown Provider',
    status: 'active',
    location: 'Gaming Zone D',
    gameMix: 'Premium Games',
    createdAt: new Date('2025-09-17'),
    updatedAt: new Date('2025-09-17')
  }
];

// Get all cabinets
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', provider = '' } = req.query;
    
    let filteredCabinets = cabinets;
    
    // Filter by search
    if (search) {
      filteredCabinets = filteredCabinets.filter(cabinet =>
        cabinet.name.toLowerCase().includes(search.toLowerCase()) ||
        cabinet.location.toLowerCase().includes(search.toLowerCase()) ||
        cabinet.gameMix.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by status
    if (status) {
      filteredCabinets = filteredCabinets.filter(cabinet => cabinet.status === status);
    }
    
    // Filter by provider
    if (provider) {
      filteredCabinets = filteredCabinets.filter(cabinet => 
        cabinet.provider.toLowerCase().includes(provider.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCabinets = filteredCabinets.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedCabinets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCabinets.length / limit),
        totalItems: filteredCabinets.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get cabinets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cabinet by ID
router.get('/:id', (req, res) => {
  try {
    const cabinet = cabinets.find(c => c.id === parseInt(req.params.id));
    
    if (!cabinet) {
      return res.status(404).json({ error: 'Cabinet not found' });
    }
    
    res.json({ success: true, data: cabinet });
  } catch (error) {
    console.error('Get cabinet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new cabinet
router.post('/', (req, res) => {
  try {
    const { name, provider, status = 'active', location, gameMix } = req.body;
    
    if (!name || !provider || !location || !gameMix) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    const newCabinet = {
      id: cabinets.length + 1,
      name,
      provider,
      status,
      location,
      gameMix,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    cabinets.push(newCabinet);
    
    res.status(201).json({
      success: true,
      message: 'Cabinet created successfully',
      data: newCabinet
    });
  } catch (error) {
    console.error('Create cabinet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cabinet
router.put('/:id', (req, res) => {
  try {
    const cabinetId = parseInt(req.params.id);
    const cabinetIndex = cabinets.findIndex(c => c.id === cabinetId);
    
    if (cabinetIndex === -1) {
      return res.status(404).json({ error: 'Cabinet not found' });
    }
    
    const { name, provider, status, location, gameMix } = req.body;
    
    // Update cabinet
    cabinets[cabinetIndex] = {
      ...cabinets[cabinetIndex],
      ...(name && { name }),
      ...(provider && { provider }),
      ...(status && { status }),
      ...(location && { location }),
      ...(gameMix && { gameMix }),
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      message: 'Cabinet updated successfully',
      data: cabinets[cabinetIndex]
    });
  } catch (error) {
    console.error('Update cabinet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete cabinet
router.delete('/:id', (req, res) => {
  try {
    const cabinetId = parseInt(req.params.id);
    const cabinetIndex = cabinets.findIndex(c => c.id === cabinetId);
    
    if (cabinetIndex === -1) {
      return res.status(404).json({ error: 'Cabinet not found' });
    }
    
    cabinets.splice(cabinetIndex, 1);
    
    res.json({
      success: true,
      message: 'Cabinet deleted successfully'
    });
  } catch (error) {
    console.error('Delete cabinet error:', error);
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
    
    const deletedCount = cabinets.filter(c => ids.includes(c.id)).length;
    cabinets = cabinets.filter(c => !ids.includes(c.id));
    
    res.json({
      success: true,
      message: `${deletedCount} cabinets deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
