const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * Generate JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new USER (NOT admin)
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login USER or ADMIN
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check in User collection first
    let user = await User.findOne({ email });
    let role = 'user';

    // If not found in User, check Admin collection
    if (!user) {
      user = await Admin.findOne({ email });
      role = 'admin';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role,
      points: user.points || 0,
      token: generateToken(user._id, role),
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user (with fresh data from database)
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    // Fetch fresh user data from database
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user._id).select('-password');
    } else {
      user = await User.findById(req.user._id).select('-password');
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data with role explicitly included
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: req.user.role, // From JWT token
      points: user.points || 0,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user/admin password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    // Get user with password field
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user._id);
    } else {
      user = await User.findById(req.user._id);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
