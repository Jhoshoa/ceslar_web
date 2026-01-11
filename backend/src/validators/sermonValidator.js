const { body, param, query } = require('express-validator');
const { SERMON_CATEGORIES } = require('../commons/constants');

const createSermonValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('speakerName')
    .trim()
    .notEmpty().withMessage('Speaker name is required'),
  body('date')
    .isISO8601().withMessage('Invalid date format'),
  body('category')
    .optional()
    .isIn(Object.values(SERMON_CATEGORIES)).withMessage('Invalid sermon category'),
  body('scripture.book')
    .optional()
    .trim(),
  body('media.videoUrl')
    .optional()
    .isURL().withMessage('Invalid video URL'),
  body('media.audioUrl')
    .optional()
    .isURL().withMessage('Invalid audio URL'),
  body('duration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];

const updateSermonValidator = [
  param('id')
    .isMongoId().withMessage('Invalid sermon ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('category')
    .optional()
    .isIn(Object.values(SERMON_CATEGORIES)).withMessage('Invalid sermon category')
];

const sermonIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid sermon ID')
];

const listSermonsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(Object.values(SERMON_CATEGORIES)).withMessage('Invalid sermon category'),
  query('speaker')
    .optional()
    .isMongoId().withMessage('Invalid speaker ID')
];

module.exports = {
  createSermonValidator,
  updateSermonValidator,
  sermonIdValidator,
  listSermonsValidator
};
