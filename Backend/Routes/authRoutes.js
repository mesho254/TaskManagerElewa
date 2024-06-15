const express = require('express');
const {
  signup,
  login,
  assignRole,
  getAllUsers,
  getEmployeeUsers,
  getManagerUsers,
  uploadProfileImage,
  getUser, 
  forgotPassword1,
  resetPassword1, 
  getResetToken,
  removeUser, 
  editUser,
  changePassword
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
router.post("/forgot-password1", forgotPassword1)
router.get("/password-reset/:id/:token", getResetToken)
router.post("/password-reset/:id/:token", resetPassword1)
router.delete('/deleteUser/:userId', removeUser);
router.put('/updateUser/:userId', editUser);
router.put('/changePassword', changePassword);

module.exports = router;
