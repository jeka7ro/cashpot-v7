const express = require('express');
const router = express.Router();

let users = [
  { id: 1, username: 'admin', firstName: 'Administrator', lastName: 'Sistem', role: 'admin', status: 'active', createdAt: new Date() },
  { id: 2, username: 'manager', firstName: 'Manager', lastName: 'Gaming', role: 'manager', status: 'active', createdAt: new Date() },
  { id: 3, username: 'operator', firstName: 'Operator', lastName: 'Floor', role: 'operator', status: 'active', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: users });
});

module.exports = router;
