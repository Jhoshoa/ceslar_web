const userService = require('../services/userService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

const userController = {
  // Get current user profile
  getMe: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    if (!user) {
      return ResponseHandler.notFound(res, 'User profile not found');
    }

    ResponseHandler.success(res, user);
  }),

  // Create or update user on first login
  syncUser: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    let user = await userService.getUserByAuth0Id(auth0Id);

    if (user) {
      await userService.updateLastLogin(auth0Id);
      return ResponseHandler.success(res, user, 'User synced successfully');
    }

    // Create new user from Auth0 data
    const userData = {
      auth0Id,
      email: req.body.email,
      firstName: req.body.firstName || req.body.given_name || 'New',
      lastName: req.body.lastName || req.body.family_name || 'User',
      avatar: req.body.picture
    };

    user = await userService.createUser(userData);
    ResponseHandler.created(res, user, 'User created successfully');
  }),

  // Update current user profile
  updateMe: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const currentUser = await userService.getUserByAuth0Id(auth0Id);

    if (!currentUser) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'dateOfBirth', 'preferences'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await userService.updateUser(currentUser._id, updateData);
    ResponseHandler.success(res, user, 'Profile updated successfully');
  }),

  // Admin: Get user by ID
  getUserById: asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    ResponseHandler.success(res, user);
  }),

  // Admin: Update user
  updateUser: asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    ResponseHandler.success(res, user, 'User updated successfully');
  }),

  // Admin: Delete user
  deleteUser: asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    ResponseHandler.success(res, null, 'User deleted successfully');
  }),

  // Admin: List all users
  listUsers: asyncHandler(async (req, res) => {
    const { users, pagination } = await userService.listUsers(req.query);
    ResponseHandler.paginated(res, users, pagination);
  }),

  // Get member directory (authenticated members only)
  getDirectory: asyncHandler(async (req, res) => {
    const { members, pagination } = await userService.getDirectoryMembers(req.query);
    ResponseHandler.paginated(res, members, pagination);
  })
};

module.exports = userController;
