const express = require('express');
const {
  createDepartment,
  addEmployee,
  moveEmployee,
  removeEmployee,
  getAllDepartments,
  deleteDepartment,
  updateDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../MiddleWares/authMiddleware');

const router = express.Router();

router.post('/create', createDepartment);
router.post('/add-employee', addEmployee);
router.post('/move-employee', moveEmployee);
router.post('/remove-employee', removeEmployee);
router.delete('/delete/:departmentId', deleteDepartment);
router.put('/update/:departmentId', updateDepartment);
router.get('/', getAllDepartments);

module.exports = router;
