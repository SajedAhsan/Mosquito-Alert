const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * Report Routes
 */

// @route   POST /api/reports
// @desc    Create new report with image upload
// @access  Private (User)
router.post('/', protect, upload.single('image'), createReport);

// @route   GET /api/reports
// @desc    Get all reports (public feed)
// @access  Private
router.get('/', protect, getAllReports);

// @route   GET /api/reports/my-reports
// @desc    Get current user's reports
// @access  Private
router.get('/my-reports', protect, getMyReports);

// @route   GET /api/reports/:id
// @desc    Get single report
// @access  Private
router.get('/:id', protect, getReportById);

// @route   DELETE /api/reports/:id
// @desc    Delete user's own report
// @access  Private (User)
router.delete('/:id', protect, deleteReport);

// @route   PUT /api/reports/:id/status
// @desc    Update report status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', protect, adminOnly, updateReportStatus);

module.exports = router;
