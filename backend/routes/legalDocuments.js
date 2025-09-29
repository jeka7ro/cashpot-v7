const express = require('express');
const router = express.Router();

let legalDocuments = [
  { id: 1, name: 'License Agreement', type: 'Contract', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Compliance Certificate', type: 'Certificate', status: 'active', createdAt: new Date() },
  { id: 3, name: 'Insurance Policy', type: 'Insurance', status: 'active', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: legalDocuments });
});

module.exports = router;
