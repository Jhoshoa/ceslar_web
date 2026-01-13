const churchService = require('../services/churchService');
const userService = require('../services/userService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');
const { uploadImage, deleteImage } = require('../helpers/cloudinary');

const churchController = {
  // Create church (system admin only)
  createChurch: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    const church = await churchService.createChurch(req.body, user?._id);
    ResponseHandler.created(res, church, 'Church created successfully');
  }),

  // Get church by ID
  getChurch: asyncHandler(async (req, res) => {
    const church = await churchService.getChurchById(req.params.id);
    ResponseHandler.success(res, church);
  }),

  // Get church by slug (public)
  getChurchBySlug: asyncHandler(async (req, res) => {
    const church = await churchService.getChurchBySlug(req.params.slug);
    ResponseHandler.success(res, church);
  }),

  // Update church (admin)
  updateChurch: asyncHandler(async (req, res) => {
    const church = await churchService.updateChurch(req.params.id, req.body);
    ResponseHandler.success(res, church, 'Church updated successfully');
  }),

  // Delete church (system admin only)
  deleteChurch: asyncHandler(async (req, res) => {
    await churchService.deleteChurch(req.params.id);
    ResponseHandler.success(res, null, 'Church deleted successfully');
  }),

  // List churches (public)
  listChurches: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, ...query } = req.query;
    const churches = await churchService.listChurches(query, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    ResponseHandler.success(res, churches);
  }),

  // Get headquarters (public)
  getHeadquarters: asyncHandler(async (req, res) => {
    const headquarters = await churchService.getHeadquarters();
    ResponseHandler.success(res, headquarters);
  }),

  // Get churches grouped by location (public - for navigation)
  getChurchesGrouped: asyncHandler(async (req, res) => {
    const grouped = await churchService.getChurchesGroupedByLocation();
    ResponseHandler.success(res, grouped);
  }),

  // Get church hierarchy
  getChurchHierarchy: asyncHandler(async (req, res) => {
    const hierarchy = await churchService.getChurchHierarchy(req.params.id);
    ResponseHandler.success(res, hierarchy);
  }),

  // Get child churches
  getChildChurches: asyncHandler(async (req, res) => {
    const children = await churchService.getChildChurches(req.params.id);
    ResponseHandler.success(res, children);
  }),

  // Get available countries (public - for cascading dropdown)
  getCountries: asyncHandler(async (req, res) => {
    const countries = await churchService.getAvailableCountries();
    ResponseHandler.success(res, countries);
  }),

  // Get departments by country (public - for cascading dropdown)
  getDepartments: asyncHandler(async (req, res) => {
    const departments = await churchService.getDepartmentsByCountry(
      req.params.country
    );
    ResponseHandler.success(res, departments);
  }),

  // Get cities by department (public - for cascading dropdown)
  getCities: asyncHandler(async (req, res) => {
    const cities = await churchService.getCitiesByDepartment(
      req.params.country,
      req.params.department
    );
    ResponseHandler.success(res, cities);
  }),

  // Get churches by country (public)
  getChurchesByCountry: asyncHandler(async (req, res) => {
    const churches = await churchService.getChurchesByCountry(
      req.params.country
    );
    ResponseHandler.success(res, churches);
  }),

  // Add leadership (admin)
  addLeadership: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    const church = await churchService.addLeadership(
      req.params.id,
      req.body,
      user?._id
    );
    ResponseHandler.success(res, church, 'Leadership added successfully');
  }),

  // Remove leadership (admin)
  removeLeadership: asyncHandler(async (req, res) => {
    const church = await churchService.removeLeadership(
      req.params.id,
      req.params.leadershipId
    );
    ResponseHandler.success(res, church, 'Leadership removed successfully');
  }),

  // Update church status (system admin)
  updateStatus: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    const church = await churchService.updateChurchStatus(
      req.params.id,
      req.body.status,
      user?._id
    );
    ResponseHandler.success(res, church, 'Church status updated successfully');
  }),

  // Upload church logo (admin)
  uploadLogo: asyncHandler(async (req, res) => {
    if (!req.file) {
      return ResponseHandler.badRequest(res, 'No file uploaded');
    }

    const result = await uploadImage(req.file.buffer, {
      folder: 'churches/logos',
      width: 400,
      height: 400,
      crop: 'fill',
    });

    const church = await churchService.updateChurch(req.params.id, {
      logo: result.url,
    });

    ResponseHandler.success(res, church, 'Logo uploaded successfully');
  }),

  // Upload church cover image (admin)
  uploadCoverImage: asyncHandler(async (req, res) => {
    if (!req.file) {
      return ResponseHandler.badRequest(res, 'No file uploaded');
    }

    const result = await uploadImage(req.file.buffer, {
      folder: 'churches/covers',
      width: 1920,
      height: 600,
      crop: 'fill',
    });

    const church = await churchService.updateChurch(req.params.id, {
      coverImage: result.url,
    });

    ResponseHandler.success(res, church, 'Cover image uploaded successfully');
  }),

  // Add gallery image (admin)
  addGalleryImage: asyncHandler(async (req, res) => {
    if (!req.file) {
      return ResponseHandler.badRequest(res, 'No file uploaded');
    }

    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    const result = await uploadImage(req.file.buffer, {
      folder: 'churches/gallery',
      width: 1200,
    });

    const imageData = {
      url: result.url,
      caption: req.body.caption ? JSON.parse(req.body.caption) : {},
    };

    const church = await churchService.addGalleryImage(
      req.params.id,
      imageData,
      user?._id
    );

    ResponseHandler.success(res, church, 'Gallery image added successfully');
  }),

  // Remove gallery image (admin)
  removeGalleryImage: asyncHandler(async (req, res) => {
    const imageIndex = parseInt(req.params.imageIndex, 10);
    const church = await churchService.removeGalleryImage(
      req.params.id,
      imageIndex
    );
    ResponseHandler.success(res, church, 'Gallery image removed successfully');
  }),

  // Get nearby churches (public)
  getNearbyChurches: asyncHandler(async (req, res) => {
    const { lat, lng, maxDistance = 50 } = req.query;

    if (!lat || !lng) {
      return ResponseHandler.badRequest(
        res,
        'Latitude and longitude are required'
      );
    }

    const churches = await churchService.getNearbyChurches(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(maxDistance)
    );

    ResponseHandler.success(res, churches);
  }),
};

module.exports = churchController;
