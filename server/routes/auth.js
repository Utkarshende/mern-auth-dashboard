const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create and Save User
    const user = new User({ name, email, password });
    await user.save(); // The hashing happens automatically in the Model

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: err.message 
    });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  // ... your existing login logic ...
});

module.exports = router;