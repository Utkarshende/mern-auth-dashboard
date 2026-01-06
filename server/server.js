const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. MANUAL CORS MIDDLEWARE (Fixed for Node v22 compatibility)
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://mern-auth-dashboard.netlify.app"
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // FIX: Handle Preflight (OPTIONS) without using the '*' wildcard that crashes Node v22
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// 2. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// 3. DATABASE CONNECTION
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });