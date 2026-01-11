const { body, param, query } = require('express-validator');
const { EVENT_TYPES, EVENT_STATUS } = require('../commons/constants');

const createEventValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('type')
    .isIn(Object.values(EVENT_TYPES)).withMessage('Invalid event type'),
  body('startDate')
    .isISO8601().withMessage('Invalid start date format'),
  body('endDate')
    .isISO8601().withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('location.name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location name must be less than 100 characters'),
  body('registration.maxAttendees')
    .optional()
    .isInt({ min: 1 }).withMessage('Max attendees must be at least 1'),
  body('registration.fee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Fee must be a positive number')
];

const updateEventValidator = [
  param('id')
    .isMongoId().withMessage('Invalid event ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('status')
    .optional()
    .isIn(Object.values(EVENT_STATUS)).withMessage('Invalid event status'),
  body('type')
    .optional()
    .isIn(Object.values(EVENT_TYPES)).withMessage('Invalid event type')
];

const eventIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid event ID')
];

const listEventsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(Object.values(EVENT_TYPES)).withMessage('Invalid event type'),
  query('status')
    .optional()
    .isIn(Object.values(EVENT_STATUS)).withMessage('Invalid event status')
];

module.exports = {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
  listEventsValidator
};
