const express = require('express');
const router = express.Router();

let onjnReports = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: onjnReports });
});

module.exports = router;
