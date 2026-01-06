const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. FULL CORS CONFIGURATION
// Add your specific Netlify URL to this array
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://mern-auth-dashboard.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// 3. HEALTH CHECK (Helps Render keep the service alive)
app.get('/health', (req, res) => res.status(200).send('Server is healthy'));

// 4. DATABASE CONNECTION
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });a