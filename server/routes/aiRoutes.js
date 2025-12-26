const express = require('express');
const router = express.Router();
const { validateImage } = require('../controllers/aiController');
const upload = require('../middleware/upload');

/**
 * AI Validation Routes
 */

// @route   POST /api/ai/validate-image
// @desc    Validate image using AI
// @access  Public
router.post('/validate-image', upload.single('image'), validateImage);

module.exports = router;
