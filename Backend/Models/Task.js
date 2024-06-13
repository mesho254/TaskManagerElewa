const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    default: uuidv4, 
},
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'done'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
