const express = require('express');
const router = express.Router();

let locations = [
  { id: 1, name: 'Main Floor', address: 'Ground Level', status: 'active', createdAt: new Date() },
  { id: 2, name: 'VIP Area', address: 'First Floor', status: 'active', createdAt: new Date() },
  { id: 3, name: 'Gaming Zone A', address: 'Left Wing', status: 'active', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: locations });
});

router.post('/', (req, res) => {
  const { name, address, status = 'active' } = req.body;
  const newLocation = { id: locations.length + 1, name, address, status, createdAt: new Date() };
  locations.push(newLocation);
  res.status(201).json({ success: true, data: newLocation });
});

module.exports = router;
