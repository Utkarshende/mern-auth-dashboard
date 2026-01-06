const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @route   GET /api/tasks (Fetch all)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/tasks (Create)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title, user: req.user.id });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/tasks/:id (The Fix for 404 on Update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    // Find task by ID from URL params
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task.title = title;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/tasks/:id (The Fix for 404 on Delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;