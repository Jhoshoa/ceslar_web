const express = require('express');
const router = express.Router();
const churchController = require('../controllers/churchController');
const { checkJwt, checkRoles } = require('../config/auth0');
const validateRequest = require('../middlewares/validateRequest');
const { upload } = require('../helpers/fileUpload');
const { body, param, query } = require('express-validator');

// Validators
const churchIdValidator = [
  param('id').isMongoId().withMessage('Invalid church ID'),
];

const slugValidator = [
  param('slug').notEmpty().withMessage('Slug is required'),
];

const countryValidator = [
  param('country').notEmpty().withMessage('Country is required'),
];

const createChurchValidator = [
  body('name').trim().notEmpty().withMessage('Church name is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('level')
    .optional()
    .isIn(['headquarters', 'country', 'department', 'province', 'local'])
    .withMessage('Invalid church level'),
];

const updateStatusValidator = [
  body('status')
    .isIn(['pending', 'active', 'inactive', 'suspended'])
    .withMessage('Invalid status'),
];

const leadershipValidator = [
  body('user').isMongoId().withMessage('Invalid user ID'),
  body('role')
    .isIn(['senior_pastor', 'pastor', 'elder', 'deacon', 'leader', 'coordinator'])
    .withMessage('Invalid role'),
];

// =====================
// Public routes
// =====================

// Get headquarters
router.get('/headquarters', churchController.getHeadquarters);

// Get churches grouped by location (for navigation)
router.get('/grouped', churchController.getChurchesGrouped);

// Get available countries (for cascading dropdown)
router.get('/countries', churchController.getCountries);

// Get departments by country (for cascading dropdown)
router.get(
  '/countries/:country/departments',
  countryValidator,
  validateRequest,
  churchController.getDepartments
);

// Get cities by department (for cascading dropdown)
router.get(
  '/countries/:country/departments/:department/cities',
  churchController.getCities
);

// Get churches by country
router.get(
  '/country/:country',
  countryValidator,
  validateRequest,
  churchController.getChurchesByCountry
);

// Get nearby churches
router.get('/nearby', churchController.getNearbyChurches);

// List all churches
router.get('/', churchController.listChurches);

// Get church by slug
router.get(
  '/slug/:slug',
  slugValidator,
  validateRequest,
  churchController.getChurchBySlug
);

// Get church by ID
router.get(
  '/:id',
  churchIdValidator,
  validateRequest,
  churchController.getChurch
);

// Get church hierarchy
router.get(
  '/:id/hierarchy',
  churchIdValidator,
  validateRequest,
  churchController.getChurchHierarchy
);

// Get child churches
router.get(
  '/:id/children',
  churchIdValidator,
  validateRequest,
  churchController.getChildChurches
);

// =====================
// Protected routes (authenticated users)
// =====================

// None for now - all modifications require admin role

// =====================
// Admin routes (church admin)
// =====================

// Update church
router.put(
  '/:id',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  validateRequest,
  churchController.updateChurch
);

// Upload logo
router.post(
  '/:id/logo',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  validateRequest,
  upload.single('logo'),
  churchController.uploadLogo
);

// Upload cover image
router.post(
  '/:id/cover',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  validateRequest,
  upload.single('cover'),
  churchController.uploadCoverImage
);

// Add gallery image
router.post(
  '/:id/gallery',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  validateRequest,
  upload.single('image'),
  churchController.addGalleryImage
);

// Remove gallery image
router.delete(
  '/:id/gallery/:imageIndex',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  validateRequest,
  churchController.removeGalleryImage
);

// Add leadership
router.post(
  '/:id/leadership',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  leadershipValidator,
  validateRequest,
  churchController.addLeadership
);

// Remove leadership
router.delete(
  '/:id/leadership/:leadershipId',
  checkJwt,
  checkRoles(['admin']),
  churchIdValidator,
  validateRequest,
  churchController.removeLeadership
);

// =====================
// System admin routes
// =====================

// Create church
router.post(
  '/',
  checkJwt,
  checkRoles(['system_admin']),
  createChurchValidator,
  validateRequest,
  churchController.createChurch
);

// Update church status
router.patch(
  '/:id/status',
  checkJwt,
  checkRoles(['system_admin']),
  churchIdValidator,
  updateStatusValidator,
  validateRequest,
  churchController.updateStatus
);

// Delete church
router.delete(
  '/:id',
  checkJwt,
  checkRoles(['system_admin']),
  churchIdValidator,
  validateRequest,
  churchController.deleteChurch
);

module.exports = router;
