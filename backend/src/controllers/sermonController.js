const sermonService = require('../services/sermonService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

const sermonController = {
  // Create sermon (staff/admin)
  createSermon: asyncHandler(async (req, res) => {
    const sermon = await sermonService.createSermon(req.body);
    ResponseHandler.created(res, sermon, 'Sermon created successfully');
  }),

  // Get sermon by ID
  getSermon: asyncHandler(async (req, res) => {
    const sermon = await sermonService.getSermonById(req.params.id, true);
    ResponseHandler.success(res, sermon);
  }),

  // Get sermon by slug (public)
  getSermonBySlug: asyncHandler(async (req, res) => {
    const sermon = await sermonService.getSermonBySlug(req.params.slug, true);
    ResponseHandler.success(res, sermon);
  }),

  // Update sermon (staff/admin)
  updateSermon: asyncHandler(async (req, res) => {
    const sermon = await sermonService.updateSermon(req.params.id, req.body);
    ResponseHandler.success(res, sermon, 'Sermon updated successfully');
  }),

  // Delete sermon (admin)
  deleteSermon: asyncHandler(async (req, res) => {
    await sermonService.deleteSermon(req.params.id);
    ResponseHandler.success(res, null, 'Sermon deleted successfully');
  }),

  // List sermons with filters
  listSermons: asyncHandler(async (req, res) => {
    // Check if user is authenticated member
    const isMember = req.auth?.payload?.sub ? true : false;
    const { sermons, pagination } = await sermonService.listSermons(req.query, isMember);
    ResponseHandler.paginated(res, sermons, pagination);
  }),

  // Get latest sermon (public)
  getLatestSermon: asyncHandler(async (req, res) => {
    const sermon = await sermonService.getLatestSermon();
    ResponseHandler.success(res, sermon);
  }),

  // Get featured sermons (public)
  getFeaturedSermons: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 3;
    const sermons = await sermonService.getFeaturedSermons(limit);
    ResponseHandler.success(res, sermons);
  }),

  // Get sermon series list
  getSermonSeries: asyncHandler(async (req, res) => {
    const series = await sermonService.getSermonSeries();
    ResponseHandler.success(res, series);
  }),

  // Get popular tags
  getSermonTags: asyncHandler(async (req, res) => {
    const tags = await sermonService.getSermonTags();
    ResponseHandler.success(res, tags);
  })
};

module.exports = sermonController;
