const express = require('express');
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  assignTask,
  getTasksForUser
} = require('../controllers/taskController');

const router = express.Router();
router.post('/create', createTask)
router.put('/update',updateTask)
router.delete('/delete', deleteTask);
router.get('/', getTasks);
router.get('/userTask', getTasksForUser )
router.post('/assign', assignTask);

module.exports = router;
