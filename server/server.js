require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/taskRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));