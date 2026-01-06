const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// GET ALL TASKS
router.get('/', authMiddleware, async (req, res) => {
  try {
    // req.user.id is populated by the authMiddleware
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Always return an array, even if empty, so the frontend doesn't crash
    res.json(tasks || []); 
  } catch (err) {
    console.error("GET TASKS ERROR:", err.message);
    res.status(500).json({ message: 'Server Error fetching tasks' });
  }
});

// CREATE TASK
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newTask = new Task({
      title,
      user: req.user.id
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error creating task' });
  }
});

// UPDATE TASK
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, completed } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task.title = title || task.title;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error updating task' });
  }
});

// DELETE TASK
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error deleting task' });
  }
});

module.exports = router;