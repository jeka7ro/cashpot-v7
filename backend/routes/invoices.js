const express = require('express');
const router = express.Router();

let invoices = [
  { id: 1, number: 'INV-001', amount: 1500, status: 'paid', createdAt: new Date() },
  { id: 2, number: 'INV-002', amount: 2300, status: 'pending', createdAt: new Date() },
  { id: 3, number: 'INV-003', amount: 800, status: 'paid', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: invoices });
});

module.exports = router;
