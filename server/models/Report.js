const mongoose = require('mongoose');

/**
 * Report Schema - Mosquito breeding site reports
 * No AI validation - Admin manually reviews and validates
 */
const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
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
  imagePath: {
    type: String,
    required: [true, 'Image is required'],
  },
  status: {
    type: String,
    default: 'PENDING',
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

// Index for efficient queries
reportSchema.index({ location: 1, breedingType: 1, date: 1 });

module.exports = mongoose.model('Report', reportSchema);
