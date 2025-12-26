const mongoose = require('mongoose');

/**
 * Report Schema - Mosquito breeding site reports
 * AI validation is performed before submission
 */
const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // `location` can contain coordinates (`lat`/`lng`) and/or a textual `address`.
  // Map selection is optional; either coords or address (or both) are allowed.
  location: {
    lat: {
      type: Number,
      min: [-90, 'Latitude must be >= -90'],
      max: [90, 'Latitude must be <= 90'],
    },
    lng: {
      type: Number,
      min: [-180, 'Longitude must be >= -180'],
      max: [180, 'Longitude must be <= 180'],
    },
    address: {
      type: String,
      trim: true,
    },
  },
  locationText: {
    type: String,
    trim: true,
  },
  breedingType: {
    type: String,
    required: [true, 'Breeding type is required'],
    enum: ['Standing Water', 'Trash', 'Drain'],
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['Low', 'Medium', 'High'],
  },
  description: {
    type: String,
    trim: true,
  },
  imagePath: {
    type: String,
    required: [true, 'Image is required'],
  },
  status: {
    type: String,
    default: 'VALID',
    enum: ['PENDING', 'VALID', 'INVALID', 'IN_PROGRESS', 'CLEARED'],
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries (index coordinates separately)
reportSchema.index({ 'location.lat': 1, 'location.lng': 1, breedingType: 1, date: 1 });

module.exports = mongoose.model('Report', reportSchema);
