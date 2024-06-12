const Department = require('../Models/Department');
const User = require('../Models/User');

exports.createDepartment = async (req, res) => {
  const { name } = req.body;

  try {
    const department = await Department.create({ name });
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
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    department.employees.pull(userId);
    await department.save();

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
