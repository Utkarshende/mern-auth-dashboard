const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. IMPROVED CORS: Allow your specific Vercel URL and Localhost
app.use(cors({
  origin: ["http://localhost:3000", "https://mern-auth-dashboard-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// 2. Health Check Route (Essential for Render to see the app is "Alive")
app.get('/health', (req, res) => res.status(200).send('Server is healthy'));

// 3. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// 4. Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Force exit so Render knows it failed
  });