const { body, param, query } = require('express-validator');
const { ROLES } = require('../commons/constants');

const createUserValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-()]{10,}$/).withMessage('Invalid phone number format'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role')
];

const updateUserValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-()]{10,}$/).withMessage('Invalid phone number format'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role')
];

const userIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID')
];

const listUsersValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),
  query('isMember')
    .optional()
    .isBoolean().withMessage('isMember must be a boolean')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
  listUsersValidator
};
