const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",                     // For local development
  "https://taskpulse-mern.vercel.app",         // REPLACE with your actual Vercel/Netlify URL
  "https://taskpulse-mern.netlify.app"         // Optional: Add both if you are testing both
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 2. HEALTH CHECK ENDPOINT
app.get('/', (req, res) => {
  res.status(200).json({ message: "TaskPulse API is live and healthy" });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });