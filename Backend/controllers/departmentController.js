const Department = require('../Models/Department');
const User = require('../Models/User');

exports.createDepartment = async (req, res) => {
  const { name, employees } = req.body;

  try {
    const department = await Department.create({ name, employees });
    res.status(201).json({ department });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addEmployee = async (req, res) => {
  const { departmentId, userId } = req.body;

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    department.employees.push(user);
    await department.save();

    res.status(200).json({ message: 'Employee added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.moveEmployee = async (req, res) => {
  const { oldDepartmentId, newDepartmentId, userId } = req.body;

  try {
    const oldDepartment = await Department.findById(oldDepartmentId);
    if (!oldDepartment) {
      return res.status(404).json({ error: 'Old department not found' });
    }

    const newDepartment = await Department.findById(newDepartmentId);
    if (!newDepartment) {
      return res.status(404).json({ error: 'New department not found' });
    }

    oldDepartment.employees.pull(userId);
    await oldDepartment.save();

    newDepartment.employees.push(userId);
    await newDepartment.save();

    res.status(200).json({ message: 'Employee moved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeEmployee = async (req, res) => {
  const { departmentId, userId } = req.body;

  try {
    const result = await Department.updateOne(
      { _id: departmentId },
      { $pull: { employees: userId } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Department or employee not found' });
    }

    res.status(200).json({ message: 'Employee removed from department successfully' });
  } catch (error) {
    console.error('Error removing employee from department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('employees');
    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a department
exports.deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    // Find the department by departmentId and remove it
    const removedDepartment = await Department.findOneAndDelete({ _id: departmentId });

    if (!removedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};