const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const Task = require('./models/Task');
const { protect } = require('./middleware/authMiddleware');

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

// Task Routes
app.use('/api/tasks', require('./routes/taskRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.listen(5000, () => console.log("🚀 Server on 5000"));