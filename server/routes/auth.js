const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to create Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ CRITICAL ERROR: JWT_SECRET is not defined in .env file");
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create User
    const user = await User.create({ username, email, password });

    // 3. Generate Token
    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed. Check server logs." });
    }

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

module.exports = router;