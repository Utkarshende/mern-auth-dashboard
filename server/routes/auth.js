const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    // bcrypt.compare matches plain text 'password' with hashed 'user.password'
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;