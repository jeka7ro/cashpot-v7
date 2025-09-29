const express = require('express');
const router = express.Router();

let jackpots = [
  { id: 1, name: 'Mega Jackpot', amount: 50000, status: 'active', createdAt: new Date() },
  { id: 2, name: 'Super Jackpot', amount: 25000, status: 'active', createdAt: new Date() },
  { id: 3, name: 'Mini Jackpot', amount: 5000, status: 'active', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: jackpots });
});

module.exports = router;
