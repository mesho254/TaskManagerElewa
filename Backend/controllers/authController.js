const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv')
const path = require('path');
const Token = require('../Models/token')
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

dotenv.config()

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


// Forgot Password
// send password link
exports.forgotPassword1 = async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"),
		});
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });

		let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
		await sendEmail(user.email, "Click the Link below for Password Reset", url);

		res
			.status(200)
			.send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}

// verify password reset link
exports.getResetToken = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}

//  set new password
exports.resetPassword1 = async (req, res) => {
	try {
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label("Password"),
		});
		const { error } = passwordSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		if (!user.verified) user.verified = true;

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user.password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}

// Remove a user by their ID
exports.removeUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const removedUser = await User.findByIdAndDelete(userId);

    if (!removedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: removedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.editUser = async (req, res) => {
  const { userId } = req.params;
    const updatedData = req.body; // Data to be updated
  
    try {
      // Find the student by userId and update their details
      const updatedUser = await User.findOneAndUpdate(
        { userId },
        updatedData,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Respond with the updated user data
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  exports.changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    
    try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    }
    };