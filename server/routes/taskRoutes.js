const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// Get all tasks for the logged-in user
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Create a new task
router.post('/', protect, async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.create({
    user: req.user.id,
    title,
    description
  });
  res.status(201).json(task);
});

// Delete a task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task && task.user.toString() === req.user.id) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found or unauthorized' });
  }
});

module.exports = router;