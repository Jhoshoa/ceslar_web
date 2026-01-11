const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const validateRequest = require('../middlewares/validateRequest');
const { strictLimiter } = require('../middlewares/rateLimiter');
const { body } = require('express-validator');

// Homepage data
router.get('/homepage', publicController.getHomepageData);

// Church info
router.get('/church-info', publicController.getChurchInfo);

// Contact form
router.post(
  '/contact',
  strictLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('subject').optional().trim()
  ],
  validateRequest,
  publicController.submitContactForm
);

// Prayer request (public)
router.post(
  '/prayer-request',
  strictLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('request').trim().notEmpty().withMessage('Prayer request is required'),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('isAnonymous').optional().isBoolean(),
    body('visibility').optional().isIn(['public', 'private', 'prayer_team'])
  ],
  validateRequest,
  publicController.submitPrayerRequest
);

// Newsletter subscription
router.post(
  '/newsletter',
  strictLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('firstName').optional().trim()
  ],
  validateRequest,
  publicController.subscribeNewsletter
);

module.exports = router;
