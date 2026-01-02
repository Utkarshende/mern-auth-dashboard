const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

// ALLOW THE FRONTEND TO CONNECT
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-taskpulse-frontend.vercel.app" // 👈 REPLACE with your actual Vercel/Netlify URL
  ],
  credentials: true
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check to verify it's live
app.get('/', (req, res) => res.send('TaskPulse API is Running...'));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.log(err));