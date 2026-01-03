const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Pointing to the middleware folder
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // 1. Find the task by the ID passed in the URL
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Security Check: Does this task belong to the logged-in user?
    // req.user.id comes from the authMiddleware
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});


module.exports = router;