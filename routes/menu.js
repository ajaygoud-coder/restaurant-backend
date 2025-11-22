const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/', (req, res) => {
  db.all('SELECT * FROM menu', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db' });
    res.json(rows);
  });
});
router.post('/init-sample', (req, res) => {
  const sample = [
    ['Margherita Pizza','Classic cheese pizza', 7.99, 'https://via.placeholder.com/150'],
    ['Paneer Tikka','Spiced paneer with onions', 6.5, 'https://via.placeholder.com/150'],
    ['Pasta Alfredo','Creamy alfredo pasta', 8.25, 'https://via.placeholder.com/150']
  ];
  const stmt = db.prepare('INSERT INTO menu (name,description,price,image) VALUES (?,?,?,?)');
  sample.forEach(item => stmt.run(item));
  stmt.finalize(err => {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ ok: true });
  });
});
module.exports = router;
