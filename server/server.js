const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure this is the 'cors' package
require('dotenv').config();

const app = express();

// 1. ROBUST CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000",
  "https://mern-auth-dashboard.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// Manually handle OPTIONS requests (Preflight)
app.options('*', cors());

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
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });