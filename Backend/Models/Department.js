const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const DepartmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    default: uuidv4, 
},
  name: {
    type: String,
    required: true
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
