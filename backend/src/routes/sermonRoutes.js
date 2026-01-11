const express = require('express');
const router = express.Router();
const sermonController = require('../controllers/sermonController');
const { checkJwt, checkRoles } = require('../config/auth0');
const validateRequest = require('../middlewares/validateRequest');
const {
  createSermonValidator,
  updateSermonValidator,
  sermonIdValidator,
  listSermonsValidator
} = require('../validators/sermonValidator');

// Public routes
router.get('/latest', sermonController.getLatestSermon);
router.get('/featured', sermonController.getFeaturedSermons);
router.get('/series', sermonController.getSermonSeries);
router.get('/tags', sermonController.getSermonTags);
router.get('/slug/:slug', sermonController.getSermonBySlug);
router.get('/', listSermonsValidator, validateRequest, sermonController.listSermons);
router.get('/:id', sermonIdValidator, validateRequest, sermonController.getSermon);

// Admin routes
router.post('/', checkJwt, checkRoles(['admin', 'staff', 'pastor']), createSermonValidator, validateRequest, sermonController.createSermon);
router.put('/:id', checkJwt, checkRoles(['admin', 'staff', 'pastor']), updateSermonValidator, validateRequest, sermonController.updateSermon);
router.delete('/:id', checkJwt, checkRoles(['admin']), sermonIdValidator, validateRequest, sermonController.deleteSermon);

module.exports = router;
