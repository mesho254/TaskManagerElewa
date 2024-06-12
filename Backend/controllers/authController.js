const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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