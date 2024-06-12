const express = require('express');
const { signup, login, assignRole, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../MiddleWares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/allUsers', getAllUsers )
router.post('/assign-role', assignRole);

module.exports = router;
