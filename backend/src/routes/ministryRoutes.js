const express = require('express');
const router = express.Router();
const ministryController = require('../controllers/ministryController');
const { checkJwt, checkRoles } = require('../config/auth0');
const validateRequest = require('../middlewares/validateRequest');
const { body, param } = require('express-validator');

const ministryIdValidator = [
  param('id').isMongoId().withMessage('Invalid ministry ID')
];

// Public routes
router.get('/', ministryController.listMinistries);
router.get('/featured', ministryController.getFeaturedMinistries);
router.get('/slug/:slug', ministryController.getMinistryBySlug);
router.get('/:id', ministryIdValidator, validateRequest, ministryController.getMinistry);

// Protected routes
router.post('/:id/join', checkJwt, ministryIdValidator, validateRequest, ministryController.joinMinistry);
router.delete('/:id/leave', checkJwt, ministryIdValidator, validateRequest, ministryController.leaveMinistry);

// Admin routes
router.post('/', checkJwt, checkRoles(['admin']), ministryController.createMinistry);
router.put('/:id', checkJwt, checkRoles(['admin']), ministryIdValidator, validateRequest, ministryController.updateMinistry);
router.delete('/:id', checkJwt, checkRoles(['admin']), ministryIdValidator, validateRequest, ministryController.deleteMinistry);

module.exports = router;
