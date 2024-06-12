const Task = require('../Models/Task');
const User = require('../Models/User');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, assignedTo, department } = req.body;

  try {
    const task = await Task.create({ title, description, dueDate, assignedTo, department });
    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId, title, description, dueDate, status } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.status = status;
    await task.save();

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
