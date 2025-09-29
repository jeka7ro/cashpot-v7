const express = require('express');
const router = express.Router();

let gameMixes = [
  { id: 1, name: 'Classic Slots', description: 'Traditional slot games', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Premium Games', description: 'High-end gaming experience', status: 'active', createdAt: new Date() },
  { id: 3, name: 'Modern Slots', description: 'Latest slot technology', status: 'active', createdAt: new Date() },
  { id: 4, name: 'Exclusive Games', description: 'VIP exclusive content', status: 'active', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: gameMixes });
});

module.exports = router;
