const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const lang = req.query.lang === 'ua' ? 'ua' : 'en';
  const filePath = path.join(__dirname, '..', 'phrases', `${lang}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not load phrases' });
    }
    try {
      const json = JSON.parse(data);
      res.json({ phrases: json.phrases });
    } catch (e) {
      res.status(500).json({ error: 'Invalid phrases file' });
    }
  });
});

module.exports = router; 