const express = require('express');
const router = express.Router();

let warehouse = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: warehouse });
});

module.exports = router;
