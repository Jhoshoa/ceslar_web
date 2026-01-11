const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { checkJwt, checkRoles } = require('../config/auth0');
const validateRequest = require('../middlewares/validateRequest');
const {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
  listEventsValidator
} = require('../validators/eventValidator');

// Public routes
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/slug/:slug', eventController.getEventBySlug);
router.get('/', listEventsValidator, validateRequest, eventController.listEvents);
router.get('/:id', eventIdValidator, validateRequest, eventController.getEvent);

// Protected routes
router.post('/:id/register', checkJwt, eventIdValidator, validateRequest, eventController.registerForEvent);
router.delete('/:id/register', checkJwt, eventIdValidator, validateRequest, eventController.cancelRegistration);

// Admin routes
router.post('/', checkJwt, checkRoles(['admin', 'staff']), createEventValidator, validateRequest, eventController.createEvent);
router.put('/:id', checkJwt, checkRoles(['admin', 'staff']), updateEventValidator, validateRequest, eventController.updateEvent);
router.delete('/:id', checkJwt, checkRoles(['admin']), eventIdValidator, validateRequest, eventController.deleteEvent);

module.exports = router;
