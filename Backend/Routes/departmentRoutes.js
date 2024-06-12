const express = require('express');
const {
  createDepartment,
  addEmployee,
  moveEmployee,
  removeEmployee
} = require('../controllers/departmentController');
const { protect, authorize } = require('../MiddleWares/authMiddleware');

const router = express.Router();

router.post('/create', protect, authorize('manager'), createDepartment);
router.post('/add-employee', protect, authorize('manager'), addEmployee);
router.post('/move-employee', protect, authorize('manager'), moveEmployee);
router.post('/remove-employee', protect, authorize('manager'), removeEmployee);

module.exports = router;
