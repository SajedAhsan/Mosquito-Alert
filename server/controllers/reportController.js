const Report = require('../models/Report');
const User = require('../models/User');

/**
 * Report Controller - AI Validation
 * Reports are validated by AI before submission
 */

/**
 * @route   POST /api/reports
 * @desc    Create a new mosquito report (AI validated)
 * @access  Private (User only)
 */
exports.createReport = async (req, res) => {
  try {
    const { location, breedingType, severity } = req.body;

    // Parse location if sent as JSON string (coords) and/or accept textual location
    let locationObj = null;
    if (location) {
      try {
        locationObj = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (err) {
        // ignore, fallback to null
      }
    }

    const locationText = req.body.locationText && String(req.body.locationText).trim();
    const description = req.body.description && String(req.body.description).trim();

    // Require either coordinates (lat/lng) OR a textual location description
    let normalizedLocation = {};

    if (locationObj && typeof locationObj.lat !== 'undefined' && typeof locationObj.lng !== 'undefined') {
      const lat = parseFloat(locationObj.lat);
      const lng = parseFloat(locationObj.lng);

      if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ message: 'Invalid coordinates. Ensure lat is -90..90 and lng is -180..180' });
      }

      normalizedLocation.lat = lat;
      normalizedLocation.lng = lng;
    }

    if (locationText) {
      normalizedLocation.address = locationText;
    }

    if ((!normalizedLocation.lat && normalizedLocation.lat !== 0) && !normalizedLocation.address) {
      return res.status(400).json({ 
        message: 'Please provide a location: either map coordinates or a textual description (locationText)' 
      });
    }

    // Validate other required fields
    if (!breedingType || !severity) {
      return res.status(400).json({ message: 'breedingType and severity are required' });
    }

    // Image is MANDATORY
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Image upload is required. Please upload an image.' 
      });
    }

    // Create report with VALID status (AI already validated)
    const report = await Report.create({
      userId: req.user._id,
      location: normalizedLocation,
      locationText: locationText || null,
      description: description || null,
      breedingType,
      severity,
      imagePath: req.file.path, // Cloudinary URL
      status: 'VALID',
      pointsAwarded: 10, // Award points immediately since AI validated
    });

    // Update user points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10 }
    });

    // Populate user data
    const populatedReport = await Report.findById(report._id).populate('userId', 'name email');

    res.status(201).json({
      message: 'Report created successfully! AI validated.',
      report: populatedReport,
    });
  } catch (error) {
    console.error('Create Report Error:', error.message);
    res.status(500).json({ message: 'Server error creating report' });
  }
};

/**
 * @route   GET /api/reports
 * @desc    Get all reports (for feed view)
 * @access  Private
 */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('userId', 'name email')
      .sort({ date: -1 }); // Newest first

    res.json(reports);
  } catch (error) {
    console.error('Get All Reports Error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

/**
 * @route   GET /api/reports/my-reports
 * @desc    Get current user's reports
 * @access  Private
 */
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Get My Reports Error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

/**
 * @route   GET /api/reports/:id
 * @desc    Get single report by ID
 * @access  Private
 */
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get Report By ID Error:', error.message);
    res.status(500).json({ message: 'Server error fetching report' });
  }
};

/**
 * @route   PUT /api/reports/:id/status
 * @desc    Update report status (Admin only)
 * @access  Private (Admin)
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const report = await Report.findById(req.params.id).populate('userId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const oldStatus = report.status;
    const user = await User.findById(report.userId._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle point allocation/deduction
    let pointsChange = 0;

    // If changing from PENDING to VALID, award points
    if (oldStatus === 'PENDING' && status === 'VALID') {
      pointsChange = 10;
      report.pointsAwarded = 10;
    }
    
    // If changing from PENDING to INVALID, deduct points and DELETE the report
    if (oldStatus === 'PENDING' && status === 'INVALID') {
      pointsChange = -5;
      
      // Deduct points from user
      user.points = Math.max(0, user.points + pointsChange);
      await user.save();
      
      // Delete the invalid report permanently
      await Report.findByIdAndDelete(req.params.id);
      
      return res.json({ 
        message: `Report marked as INVALID and deleted. User lost 5 points.`,
        pointsChange,
        deleted: true
      });
    }

    // If changing from VALID to INVALID, deduct awarded points
    if (oldStatus === 'VALID' && status === 'INVALID') {
      pointsChange = -report.pointsAwarded;
      report.pointsAwarded = 0;
    }

    // Update user points
    if (pointsChange !== 0) {
      user.points = Math.max(0, user.points + pointsChange); // Ensure points don't go negative
      await user.save();
    }

    // Update report status
    report.status = status;
    await report.save();

    // Populate user data before returning
    await report.populate('userId', 'name email');

    res.json({ 
      message: `Report marked as ${status}. ${pointsChange > 0 ? `User earned ${pointsChange} points.` : pointsChange < 0 ? `User lost ${Math.abs(pointsChange)} points.` : 'Status updated successfully.'}`,
      report,
      pointsChange,
    });
  } catch (error) {
    console.error('Update Status Error:', error.message);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete user's own report
 * @access  Private (User)
 */
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns the report
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    // If report was VALID and points were awarded, deduct them
    if (report.status === 'VALID' && report.pointsAwarded > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: -report.pointsAwarded },
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete Report Error:', error.message);
    res.status(500).json({ message: 'Server error deleting report' });
  }
};
