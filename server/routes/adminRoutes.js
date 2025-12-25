const express = require('express');
const router = express.Router();
const {
  getOverview,
  getWeeklyReports,
  getBreedingDistribution,
  getAreaRisk,
  getLeaderboard,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * Admin Routes
 * All routes are protected and admin-only except leaderboard
 */

// @route   GET /api/admin/leaderboard
// @desc    Get top contributors (PUBLIC - all users can access)
// @access  Private (All authenticated users)
router.get('/leaderboard', protect, getLeaderboard);

// Apply admin middleware to remaining routes
router.use(protect, adminOnly);

// @route   GET /api/admin/analytics/overview
// @desc    Get overview statistics
// @access  Private (Admin)
router.get('/analytics/overview', getOverview);

// @route   GET /api/admin/analytics/weekly-reports
// @desc    Get weekly reports chart data
// @access  Private (Admin)
router.get('/analytics/weekly-reports', getWeeklyReports);

// @route   GET /api/admin/analytics/breeding-distribution
// @desc    Get breeding type distribution
// @access  Private (Admin)
router.get('/analytics/breeding-distribution', getBreedingDistribution);

// @route   GET /api/admin/analytics/area-risk
// @desc    Get area-wise risk assessment
// @access  Private (Admin)
router.get('/analytics/area-risk', getAreaRisk);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', getAllUsers);

module.exports = router;
