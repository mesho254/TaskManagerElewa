const express = require('express');
const {
  signup,
  login,
  assignRole,
  getAllUsers,
  getEmployeeUsers,
  getManagerUsers,
  uploadProfileImage,
  getUser
} = require('../controllers/authController');
const { protect, authorize } = require('../MiddleWares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/allUsers', getAllUsers);
router.get('/employee', getEmployeeUsers);
router.get('/manager', getManagerUsers);
router.post('/assign-role', assignRole);
router.post('/uploadProfileImage', uploadProfileImage);
router.get('/user/:email', getUser);

module.exports = router;
