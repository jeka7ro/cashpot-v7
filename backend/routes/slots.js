const express = require('express');
const router = express.Router();

let slots = Array.from({ length: 310 }, (_, i) => ({
  id: i + 1,
  name: `Slot ${i + 1}`,
  type: 'Video Slot',
  status: 'active',
  createdAt: new Date()
}));

router.get('/', (req, res) => {
  res.json({ success: true, data: slots });
});

module.exports = router;
