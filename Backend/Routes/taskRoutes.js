const express = require('express');
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks
} = require('../controllers/taskController');
const { protect, authorize } = require('../MiddleWares/authMiddleware');

const router = express.Router();

// router.post('/create', protect, authorize('manager'), createTask);
router.post('/create', createTask)
// router.put('/update', protect, authorize('manager'), updateTask);
router.put('/update',updateTask)
router.delete('/delete', protect, authorize('manager'), deleteTask);
router.get('/', protect, getTasks);

module.exports = router;
