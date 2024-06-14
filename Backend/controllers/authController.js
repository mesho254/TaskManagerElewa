const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Create a user object without the password
      const userWithoutPassword = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };
  
      // Create and send a JWT token along with the user data
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );
  
      res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
};


exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Excluding the password field
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get users with the "employee" role only
exports.getEmployeeUsers = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }, '-password'); // Excluding the password field
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getManagerUsers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }, '-password'); // Excluding the password field
    res.status(200).json({ managers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

exports.uploadProfileImage = [
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const email = req.body.email;
      const profileImage = req.file.filename; // Store the filename, not the full path

      const user = await User.findOneAndUpdate({ email }, { profileImage }, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ profileImage: user.profileImage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }, '-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};