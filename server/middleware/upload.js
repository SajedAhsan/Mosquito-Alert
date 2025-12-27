const { upload } = require('../config/cloudinary');

/**
 * Export Cloudinary upload middleware
 * Images are now stored in Cloudinary cloud storage instead of local filesystem
 */
module.exports = upload;
