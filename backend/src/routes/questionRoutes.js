const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { checkJwt } = require('../config/auth0');
const {
  attachUser,
  requireUser,
  requireSystemAdmin
} = require('../middlewares/churchPermissions');
const validateRequest = require('../middlewares/validateRequest');
const { body, param, query } = require('express-validator');
const { QUESTION_TYPES, QUESTION_SCOPE, QUESTION_AUDIENCE } = require('../commons/constants');

// ============ Public Routes (No Auth Required) ============

// Get registration form questions (public endpoint for forms)
router.get('/registration',
  [
    query('churchId').optional().isMongoId().withMessage('Valid church ID required'),
    query('userType').optional().isIn(Object.values(QUESTION_AUDIENCE))
  ],
  validateRequest,
  questionController.getRegistrationQuestions
);

// Get question categories (public for form display)
router.get('/categories',
  [query('includeInactive').optional().isBoolean()],
  validateRequest,
  questionController.listCategories
);

// ============ Authenticated Routes ============

// Apply auth middleware for all routes below
router.use(checkJwt);
router.use(attachUser);
router.use(requireUser);

// ============ User Registration Routes ============

// Submit registration form answers
router.post('/registration/submit',
  [
    body('answers').isArray({ min: 1 }).withMessage('At least one answer is required'),
    body('answers.*.questionId').isMongoId().withMessage('Valid question ID required'),
    body('answers.*.answer').exists().withMessage('Answer is required'),
    body('churchId').optional().isMongoId().withMessage('Valid church ID required')
  ],
  validateRequest,
  questionController.submitRegistrationAnswers
);

// Get current user's registration answers
router.get('/registration/my-answers', questionController.getMyAnswers);

// ============ Admin Routes - Categories ============

// Create category (system admin only)
router.post('/categories',
  requireSystemAdmin,
  [
    body('name.es').notEmpty().withMessage('Spanish name is required'),
    body('name.en').optional().isString(),
    body('name.pt').optional().isString(),
    body('description.es').optional().isString(),
    body('description.en').optional().isString(),
    body('description.pt').optional().isString(),
    body('order').optional().isInt({ min: 0 }),
    body('isActive').optional().isBoolean()
  ],
  validateRequest,
  questionController.createCategory
);

// Get single category
router.get('/categories/:categoryId',
  [param('categoryId').isMongoId().withMessage('Valid category ID required')],
  validateRequest,
  questionController.getCategoryById
);

// Update category (system admin only)
router.put('/categories/:categoryId',
  requireSystemAdmin,
  [
    param('categoryId').isMongoId().withMessage('Valid category ID required'),
    body('name.es').optional().notEmpty(),
    body('name.en').optional().isString(),
    body('name.pt').optional().isString(),
    body('description.es').optional().isString(),
    body('description.en').optional().isString(),
    body('description.pt').optional().isString(),
    body('order').optional().isInt({ min: 0 }),
    body('isActive').optional().isBoolean()
  ],
  validateRequest,
  questionController.updateCategory
);

// Delete category (system admin only)
router.delete('/categories/:categoryId',
  requireSystemAdmin,
  [param('categoryId').isMongoId().withMessage('Valid category ID required')],
  validateRequest,
  questionController.deleteCategory
);

// Reorder categories (system admin only)
router.put('/categories/reorder',
  requireSystemAdmin,
  [
    body('orders').isArray({ min: 1 }).withMessage('Orders array is required'),
    body('orders.*.categoryId').isMongoId().withMessage('Valid category ID required'),
    body('orders.*.order').isInt({ min: 0 }).withMessage('Valid order number required')
  ],
  validateRequest,
  questionController.reorderCategories
);

// ============ Admin Routes - Questions ============

// List all questions (with filters)
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isMongoId(),
    query('scope').optional().isIn(Object.values(QUESTION_SCOPE)),
    query('churchId').optional().isMongoId(),
    query('targetAudience').optional().isIn(Object.values(QUESTION_AUDIENCE)),
    query('includeInactive').optional().isBoolean()
  ],
  validateRequest,
  questionController.listQuestions
);

// Create question (system admin only)
router.post('/',
  requireSystemAdmin,
  [
    body('questionText.es').notEmpty().withMessage('Spanish question text is required'),
    body('questionText.en').optional().isString(),
    body('questionText.pt').optional().isString(),
    body('questionType').isIn(Object.values(QUESTION_TYPES)).withMessage('Valid question type required'),
    body('category').optional().isMongoId(),
    body('options').optional().isArray(),
    body('options.*.value').optional().notEmpty(),
    body('options.*.labels.es').optional().notEmpty(),
    body('validation.isRequired').optional().isBoolean(),
    body('validation.minLength').optional().isInt({ min: 0 }),
    body('validation.maxLength').optional().isInt({ min: 1 }),
    body('validation.min').optional().isNumeric(),
    body('validation.max').optional().isNumeric(),
    body('placeholder.es').optional().isString(),
    body('placeholder.en').optional().isString(),
    body('placeholder.pt').optional().isString(),
    body('helpText.es').optional().isString(),
    body('helpText.en').optional().isString(),
    body('helpText.pt').optional().isString(),
    body('order').optional().isInt({ min: 0 }),
    body('targetAudience').optional().isIn(Object.values(QUESTION_AUDIENCE)),
    body('scope').optional().isIn(Object.values(QUESTION_SCOPE)),
    body('churches').optional().isArray(),
    body('churches.*').optional().isMongoId(),
    body('conditionalDisplay.dependsOn').optional().isMongoId(),
    body('conditionalDisplay.showWhenValue').optional(),
    body('isActive').optional().isBoolean()
  ],
  validateRequest,
  questionController.createQuestion
);

// Reorder questions (system admin only)
router.put('/reorder',
  requireSystemAdmin,
  [
    body('orders').isArray({ min: 1 }).withMessage('Orders array is required'),
    body('orders.*.questionId').isMongoId().withMessage('Valid question ID required'),
    body('orders.*.order').isInt({ min: 0 }).withMessage('Valid order number required')
  ],
  validateRequest,
  questionController.reorderQuestions
);

// Get single question
router.get('/:questionId',
  [param('questionId').isMongoId().withMessage('Valid question ID required')],
  validateRequest,
  questionController.getQuestionById
);

// Update question (system admin only)
router.put('/:questionId',
  requireSystemAdmin,
  [
    param('questionId').isMongoId().withMessage('Valid question ID required'),
    body('questionText.es').optional().notEmpty(),
    body('questionText.en').optional().isString(),
    body('questionText.pt').optional().isString(),
    body('questionType').optional().isIn(Object.values(QUESTION_TYPES)),
    body('category').optional().isMongoId(),
    body('options').optional().isArray(),
    body('validation.isRequired').optional().isBoolean(),
    body('placeholder.es').optional().isString(),
    body('helpText.es').optional().isString(),
    body('order').optional().isInt({ min: 0 }),
    body('targetAudience').optional().isIn(Object.values(QUESTION_AUDIENCE)),
    body('scope').optional().isIn(Object.values(QUESTION_SCOPE)),
    body('churches').optional().isArray(),
    body('conditionalDisplay').optional().isObject(),
    body('isActive').optional().isBoolean()
  ],
  validateRequest,
  questionController.updateQuestion
);

// Delete question (system admin only)
router.delete('/:questionId',
  requireSystemAdmin,
  [param('questionId').isMongoId().withMessage('Valid question ID required')],
  validateRequest,
  questionController.deleteQuestion
);

// Get question statistics (system admin only)
router.get('/:questionId/stats',
  requireSystemAdmin,
  [param('questionId').isMongoId().withMessage('Valid question ID required')],
  validateRequest,
  questionController.getQuestionStatistics
);

// Get all answers for a question (system admin only)
router.get('/:questionId/answers',
  requireSystemAdmin,
  [
    param('questionId').isMongoId().withMessage('Valid question ID required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  questionController.getAnswersForQuestion
);

// Get user's answers (system admin only)
router.get('/registration/users/:userId/answers',
  requireSystemAdmin,
  [param('userId').isMongoId().withMessage('Valid user ID required')],
  validateRequest,
  questionController.getUserAnswers
);

module.exports = router;
