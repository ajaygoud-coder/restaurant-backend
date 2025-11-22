const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'missing' });
  const hash = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run(username, hash, function(err) {
    if (err) return res.status(400).json({ error: 'user exists' });
    const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
    res.json({ token });
  });
});
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'db' });
    if (!row) return res.status(400).json({ error: 'no user' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ error: 'bad creds' });
    const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET);
    res.json({ token });
  });
});
module.exports = router;
