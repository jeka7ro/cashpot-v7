const express = require('express');
const router = express.Router();

let metrology = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: metrology });
});

module.exports = router;
