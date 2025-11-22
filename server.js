require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./db');
// initialize DB from init.sql if needed
try {
  const initSQL = fs.readFileSync(path.join(__dirname, 'models', 'init.sql'), 'utf8');
  db.exec(initSQL);
} catch (e) { console.log('init sql not found or failed', e); }
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
