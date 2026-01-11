const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const logger = require('./logger');

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage configuration
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter,
});

// Process and save image
const processImage = async (buffer, options = {}) => {
  const {
    width = 800,
    height = null,
    quality = 80,
    format = 'webp',
    subfolder = 'images'
  } = options;

  const uploadDir = path.join(config.upload.path, subfolder);
  ensureUploadDir(uploadDir);

  const filename = `${uuidv4()}.${format}`;
  const filepath = path.join(uploadDir, filename);

  try {
    let processor = sharp(buffer);

    if (width || height) {
      processor = processor.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    if (format === 'webp') {
      processor = processor.webp({ quality });
    } else if (format === 'jpeg' || format === 'jpg') {
      processor = processor.jpeg({ quality });
    } else if (format === 'png') {
      processor = processor.png({ quality });
    }

    await processor.toFile(filepath);

    logger.info(`Image processed and saved: ${filename}`);

    return {
      filename,
      path: filepath,
      url: `/uploads/${subfolder}/${filename}`
    };
  } catch (error) {
    logger.error('Image processing failed:', error);
    throw error;
  }
};

// Delete file
const deleteFile = async (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      logger.info(`File deleted: ${filepath}`);
    }
  } catch (error) {
    logger.error('File deletion failed:', error);
    throw error;
  }
};

module.exports = {
  upload,
  processImage,
  deleteFile
};
