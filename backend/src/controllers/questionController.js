const questionService = require('../services/questionService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

const questionController = {
  // ============ Category Endpoints ============

  /**
   * Create a new question category
   * POST /api/questions/categories
   */
  createCategory: asyncHandler(async (req, res) => {
    const category = await questionService.createCategory(req.body, req.user._id);
    ResponseHandler.created(res, category, 'Category created successfully');
  }),

  /**
   * Get all question categories
   * GET /api/questions/categories
   */
  listCategories: asyncHandler(async (req, res) => {
    const { includeInactive } = req.query;
    const categories = await questionService.listCategories({
      includeInactive: includeInactive === 'true'
    });
    ResponseHandler.success(res, categories);
  }),

  /**
   * Get a single category by ID
   * GET /api/questions/categories/:categoryId
   */
  getCategoryById: asyncHandler(async (req, res) => {
    const category = await questionService.getCategoryById(req.params.categoryId);
    ResponseHandler.success(res, category);
  }),

  /**
   * Update a question category
   * PUT /api/questions/categories/:categoryId
   */
  updateCategory: asyncHandler(async (req, res) => {
    const category = await questionService.updateCategory(
      req.params.categoryId,
      req.body
    );
    ResponseHandler.success(res, category, 'Category updated successfully');
  }),

  /**
   * Delete a question category
   * DELETE /api/questions/categories/:categoryId
   */
  deleteCategory: asyncHandler(async (req, res) => {
    await questionService.deleteCategory(req.params.categoryId);
    ResponseHandler.success(res, null, 'Category deleted successfully');
  }),

  /**
   * Reorder categories
   * PUT /api/questions/categories/reorder
   */
  reorderCategories: asyncHandler(async (req, res) => {
    const { orders } = req.body;
    const categories = await questionService.reorderCategories(orders);
    ResponseHandler.success(res, categories, 'Categories reordered successfully');
  }),

  // ============ Question Endpoints ============

  /**
   * Create a new question
   * POST /api/questions
   */
  createQuestion: asyncHandler(async (req, res) => {
    const question = await questionService.createQuestion(req.body, req.user._id);
    ResponseHandler.created(res, question, 'Question created successfully');
  }),

  /**
   * List questions with filters
   * GET /api/questions
   */
  listQuestions: asyncHandler(async (req, res) => {
    const { page, limit, category, scope, churchId, targetAudience, includeInactive } = req.query;

    const result = await questionService.listQuestions(
      { category, scope, churchId, targetAudience, includeInactive: includeInactive === 'true' },
      { page: parseInt(page) || 1, limit: parseInt(limit) || 50 }
    );

    ResponseHandler.paginated(res, result.docs, result);
  }),

  /**
   * Get a single question by ID
   * GET /api/questions/:questionId
   */
  getQuestionById: asyncHandler(async (req, res) => {
    const question = await questionService.getQuestionById(req.params.questionId);
    ResponseHandler.success(res, question);
  }),

  /**
   * Update a question
   * PUT /api/questions/:questionId
   */
  updateQuestion: asyncHandler(async (req, res) => {
    const question = await questionService.updateQuestion(
      req.params.questionId,
      req.body
    );
    ResponseHandler.success(res, question, 'Question updated successfully');
  }),

  /**
   * Delete a question
   * DELETE /api/questions/:questionId
   */
  deleteQuestion: asyncHandler(async (req, res) => {
    await questionService.deleteQuestion(req.params.questionId);
    ResponseHandler.success(res, null, 'Question deleted successfully');
  }),

  /**
   * Reorder questions
   * PUT /api/questions/reorder
   */
  reorderQuestions: asyncHandler(async (req, res) => {
    const { orders } = req.body;
    await questionService.reorderQuestions(orders);
    ResponseHandler.success(res, null, 'Questions reordered successfully');
  }),

  /**
   * Get question statistics
   * GET /api/questions/:questionId/stats
   */
  getQuestionStatistics: asyncHandler(async (req, res) => {
    const stats = await questionService.getQuestionStatistics(req.params.questionId);
    ResponseHandler.success(res, stats);
  }),

  /**
   * Get all answers for a question
   * GET /api/questions/:questionId/answers
   */
  getAnswersForQuestion: asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await questionService.getAnswersForQuestion(
      req.params.questionId,
      { page: parseInt(page) || 1, limit: parseInt(limit) || 50 }
    );
    ResponseHandler.paginated(res, result.docs, result);
  }),

  // ============ Registration Form Endpoints ============

  /**
   * Get registration form questions
   * GET /api/questions/registration
   */
  getRegistrationQuestions: asyncHandler(async (req, res) => {
    const { churchId, userType } = req.query;
    const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es';

    const questions = await questionService.getRegistrationQuestions(
      churchId || null,
      userType || 'all',
      lang
    );

    ResponseHandler.success(res, questions);
  }),

  /**
   * Submit registration form answers
   * POST /api/questions/registration/submit
   */
  submitRegistrationAnswers: asyncHandler(async (req, res) => {
    const { answers, churchId } = req.body;

    const result = await questionService.submitAnswers(
      req.user._id,
      answers,
      churchId
    );

    ResponseHandler.success(res, result, 'Registration completed successfully');
  }),

  /**
   * Get current user's registration answers
   * GET /api/questions/registration/my-answers
   */
  getMyAnswers: asyncHandler(async (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es';
    const answers = await questionService.getUserAnswers(req.user._id, lang);
    ResponseHandler.success(res, answers);
  }),

  /**
   * Get any user's registration answers (admin)
   * GET /api/questions/registration/users/:userId/answers
   */
  getUserAnswers: asyncHandler(async (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es';
    const answers = await questionService.getUserAnswers(req.params.userId, lang);
    ResponseHandler.success(res, answers);
  })
};

module.exports = questionController;
