const ministryService = require('../services/ministryService');
const userService = require('../services/userService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

const ministryController = {
  // Create ministry (admin)
  createMinistry: asyncHandler(async (req, res) => {
    const ministry = await ministryService.createMinistry(req.body);
    ResponseHandler.created(res, ministry, 'Ministry created successfully');
  }),

  // Get ministry by ID
  getMinistry: asyncHandler(async (req, res) => {
    const ministry = await ministryService.getMinistryById(req.params.id);
    ResponseHandler.success(res, ministry);
  }),

  // Get ministry by slug (public)
  getMinistryBySlug: asyncHandler(async (req, res) => {
    const ministry = await ministryService.getMinistryBySlug(req.params.slug);
    ResponseHandler.success(res, ministry);
  }),

  // Update ministry (admin)
  updateMinistry: asyncHandler(async (req, res) => {
    const ministry = await ministryService.updateMinistry(req.params.id, req.body);
    ResponseHandler.success(res, ministry, 'Ministry updated successfully');
  }),

  // Delete ministry (admin)
  deleteMinistry: asyncHandler(async (req, res) => {
    await ministryService.deleteMinistry(req.params.id);
    ResponseHandler.success(res, null, 'Ministry deleted successfully');
  }),

  // List all ministries (public)
  listMinistries: asyncHandler(async (req, res) => {
    const ministries = await ministryService.listMinistries(req.query);
    ResponseHandler.success(res, ministries);
  }),

  // Get featured ministries (public - for homepage)
  getFeaturedMinistries: asyncHandler(async (req, res) => {
    const churchId = req.query.church || null;
    const ministries = await ministryService.getFeaturedMinistries(churchId);
    ResponseHandler.success(res, ministries);
  }),

  // Join ministry (authenticated)
  joinMinistry: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const ministry = await ministryService.joinMinistry(req.params.id, user._id);
    ResponseHandler.success(res, ministry, 'Successfully joined ministry');
  }),

  // Leave ministry (authenticated)
  leaveMinistry: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const ministry = await ministryService.leaveMinistry(req.params.id, user._id);
    ResponseHandler.success(res, ministry, 'Successfully left ministry');
  })
};

module.exports = ministryController;
