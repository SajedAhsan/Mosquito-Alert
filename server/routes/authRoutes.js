const express = require('express');
const router = express.Router();
const { signup, login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * Authentication Routes
 */

// @route   POST /api/auth/signup
// @desc    User signup (NOT for admins)
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    User/Admin login
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, changePassword);

module.exports = router;
