const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      user: req.user.id
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error saving task' });
  }
});

module.exports = router;