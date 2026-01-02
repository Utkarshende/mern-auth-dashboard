const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Pointing to the middleware folder
const Task = require('../models/Task');

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title, user: req.user.id });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;