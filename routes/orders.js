const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'no token' });
  const token = authHeader.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    res.status(401).json({ error: 'invalid' });
  }
}
router.post('/place', auth, (req, res) => {
  const { items, total } = req.body;
  const stmt = db.prepare('INSERT INTO orders (user_id, items, total, status) VALUES (?,?,?,?)');
  stmt.run(req.user.id, JSON.stringify(items), total, 'placed', function(err) {
    if (err) return res.status(500).json({ error: 'db' });
    res.json({ orderId: this.lastID });
  });
});
module.exports = router;
