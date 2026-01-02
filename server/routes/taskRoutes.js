const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all user tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tasks
// @desc    Create a task
router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      user: req.user.id
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;