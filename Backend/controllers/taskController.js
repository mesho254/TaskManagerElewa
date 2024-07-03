const Task = require('../Models/Task');
const User = require('../Models/User');
const Department = require('../Models/Department')
const sendEmail = require('../utils/sendEmail')
const generateEmailContent = require('../utils/generateEmailContent');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, assignedTo, department } = req.body;

  try {
    const task = await Task.create({ title, description, dueDate, assignedTo, department });

    // Fetch the user to get their email
    const user = await User.findById(assignedTo);

    if (user) {
      const email = user.email;
      const subject = 'New Task Assigned';
      const { htmlContent, text } = generateEmailContent( title, description, dueDate);
      await sendEmail(email, subject,text, htmlContent);
    }

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

    if (status === 'done' && !task.completedAt) {
      task.completedAt = new Date();
    }

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
    const tasks = await Task.find().populate('assignedTo','email');
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

exports.getTasksForUser = async (req, res) => {
  try {
    const {userId} = req.body;
    const tasks = await Task.find({ assignedTo: userId }).populate('assignedTo', 'email');
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};
exports.assignTask = async (req, res) => {
  const { taskId, userId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const employee = await User.findById(userId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    task.assignedTo = userId;
    await task.save();

    const updatedTask = await Task.findById(taskId).populate('assignedTo', 'name'); // Populate with user details

     // Send email notification
     const email = employee.email;
     const subject = 'New Task Assigned';
     const { htmlContent, text } = generateEmailContent(task.title, task.description, task.dueDate);
     await sendEmail(email, subject,text, htmlContent);

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error)
  }
};

// exports.getDepartmentsAndEmployees = async (req, res) => {
//   try {
//     const departments = await Department.find();
//     const employees = await User.find({ role: 'employee' });
//     res.status(200).json({ departments, employees });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };