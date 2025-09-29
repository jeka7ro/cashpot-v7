const express = require('express');
const router = express.Router();

let providers = [
  { id: 1, name: 'Unknown Provider', contact: 'N/A', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Gaming Solutions Ltd', contact: 'contact@gaming.ro', status: 'active', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: providers });
});

router.post('/', (req, res) => {
  const { name, contact, status = 'active' } = req.body;
  const newProvider = { id: providers.length + 1, name, contact, status, createdAt: new Date() };
  providers.push(newProvider);
  res.status(201).json({ success: true, data: newProvider });
});

module.exports = router;
