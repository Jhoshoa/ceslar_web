const cloudinary = require('cloudinary').v2;
const config = require('../config');
const logger = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const baseFolder = config.cloudinary.folder;

/**
 * Upload an image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with url and public_id
 */
const uploadImage = async (file, options = {}) => {
  const {
    folder = 'images',
    width = null,
    height = null,
    crop = 'limit',
    format = 'auto',
    quality = 'auto',
  } = options;

  try {
    const uploadOptions = {
      folder: `${baseFolder}/${folder}`,
      resource_type: 'image',
      format,
      quality,
    };

    // Add transformation if dimensions specified
    if (width || height) {
      uploadOptions.transformation = [
        {
          width,
          height,
          crop,
        },
      ];
    }

    // Convert buffer to base64 data URI if needed
    let uploadData = file;
    if (Buffer.isBuffer(file)) {
      uploadData = `data:image/jpeg;base64,${file.toString('base64')}`;
    }

    const result = await cloudinary.uploader.upload(uploadData, uploadOptions);

    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    logger.error('Cloudinary upload failed:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file buffers or base64 strings
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleImages = async (files, options = {}) => {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, options))
  );
  return results;
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error('Cloudinary deletion failed:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    logger.info(`Multiple images deleted from Cloudinary: ${publicIds.length} images`);
    return result;
  } catch (error) {
    logger.error('Cloudinary bulk deletion failed:', error);
    throw error;
  }
};

/**
 * Generate a transformed URL for an existing image
 * @param {string} publicId - The public ID of the image
 * @param {Object} transformations - Transformation options
 * @returns {string} Transformed image URL
 */
const getTransformedUrl = (publicId, transformations = {}) => {
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = transformations;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
    secure: true,
  });
};

/**
 * Generate thumbnail URL
 * @param {string} publicId - The public ID of the image
 * @param {number} size - Thumbnail size (default 150)
 * @returns {string} Thumbnail URL
 */
const getThumbnailUrl = (publicId, size = 150) => {
  return getTransformedUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
  });
};

/**
 * Check if Cloudinary is configured
 * @returns {boolean} True if configured
 */
const isConfigured = () => {
  return !!(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret);
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getTransformedUrl,
  getThumbnailUrl,
  isConfigured,
};
