/**
 * Church-based permission middleware
 * Handles authorization based on user's role in a specific church
 */

const User = require('../models/User');
const Church = require('../models/Church');
const { CHURCH_ROLES, SYSTEM_ROLES, MEMBERSHIP_STATUS } = require('../commons/constants');

/**
 * Middleware to attach user data to request
 * Must be used after checkJwt
 */
const attachUser = async (req, res, next) => {
  try {
    if (!req.auth?.payload?.sub) {
      return next();
    }

    const user = await User.findOne({ auth0Id: req.auth.payload.sub })
      .populate('primaryChurch', 'name slug')
      .select('-__v');

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to require authenticated user
 * Must be used after attachUser
 */
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not found. Please complete your profile.',
      error: 'USER_NOT_FOUND'
    });
  }
  next();
};

/**
 * Middleware to require system admin role
 */
const requireSystemAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'UNAUTHORIZED'
    });
  }

  if (req.user.systemRole !== SYSTEM_ROLES.SYSTEM_ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'System admin privileges required',
      error: 'FORBIDDEN'
    });
  }

  next();
};

/**
 * Get church ID from request (params, query, or body)
 */
const getChurchIdFromRequest = (req) => {
  return req.params.churchId || req.query.church || req.body.church || req.body.churchId;
};

/**
 * Middleware to attach church context to request
 * Extracts churchId from params, query, or body
 */
const attachChurchContext = async (req, res, next) => {
  try {
    const churchId = getChurchIdFromRequest(req);

    if (churchId) {
      const church = await Church.findById(churchId).select('name slug status settings');
      if (church) {
        req.church = church;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware factory to require specific church roles
 * @param {string|string[]} roles - Required role(s) in the church
 * @param {Object} options - Options
 * @param {boolean} options.allowSystemAdmin - Allow system admins to bypass (default: true)
 * @param {boolean} options.checkPrimaryChurch - Use user's primary church if no church specified (default: false)
 */
const requireChurchRole = (roles, options = {}) => {
  const { allowSystemAdmin = true, checkPrimaryChurch = false } = options;
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // System admins can bypass church role checks if allowed
      if (allowSystemAdmin && req.user.systemRole === SYSTEM_ROLES.SYSTEM_ADMIN) {
        return next();
      }

      // Get church ID from request or user's primary church
      let churchId = getChurchIdFromRequest(req);

      if (!churchId && checkPrimaryChurch && req.user.primaryChurch) {
        churchId = req.user.primaryChurch._id || req.user.primaryChurch;
      }

      if (!churchId) {
        return res.status(400).json({
          success: false,
          message: 'Church ID is required',
          error: 'CHURCH_REQUIRED'
        });
      }

      // Check user's role in the church
      const userRole = req.user.getRoleInChurch(churchId);

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this church',
          error: 'NOT_MEMBER'
        });
      }

      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Required role: ${requiredRoles.join(' or ')}. Your role: ${userRole}`,
          error: 'INSUFFICIENT_ROLE'
        });
      }

      // Store user's role in request for later use
      req.userChurchRole = userRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to require church admin (admin or pastor)
 */
const requireChurchAdmin = requireChurchRole([CHURCH_ROLES.ADMIN, CHURCH_ROLES.PASTOR]);

/**
 * Middleware to require church leader or above
 */
const requireChurchLeader = requireChurchRole([
  CHURCH_ROLES.ADMIN,
  CHURCH_ROLES.PASTOR,
  CHURCH_ROLES.LEADER
]);

/**
 * Middleware to require church member or above
 */
const requireChurchMember = requireChurchRole([
  CHURCH_ROLES.ADMIN,
  CHURCH_ROLES.PASTOR,
  CHURCH_ROLES.LEADER,
  CHURCH_ROLES.MEMBER
]);

/**
 * Middleware to check if user can manage another user in a church
 * Admin/Pastor can manage Leaders, Members, Visitors
 * Leaders can only manage Members and Visitors
 */
const canManageChurchMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
    }

    // System admins can manage anyone
    if (req.user.systemRole === SYSTEM_ROLES.SYSTEM_ADMIN) {
      return next();
    }

    const churchId = getChurchIdFromRequest(req);
    const targetUserId = req.params.userId || req.body.userId;

    if (!churchId || !targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID and User ID are required',
        error: 'MISSING_PARAMS'
      });
    }

    const managerRole = req.user.getRoleInChurch(churchId);

    if (!managerRole) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this church',
        error: 'NOT_MEMBER'
      });
    }

    // Get target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const targetRole = targetUser.getRoleInChurch(churchId);

    // Define role hierarchy (lower index = higher authority)
    const roleHierarchy = [
      CHURCH_ROLES.ADMIN,
      CHURCH_ROLES.PASTOR,
      CHURCH_ROLES.LEADER,
      CHURCH_ROLES.MEMBER,
      CHURCH_ROLES.VISITOR
    ];

    const managerLevel = roleHierarchy.indexOf(managerRole);
    const targetLevel = targetRole ? roleHierarchy.indexOf(targetRole) : roleHierarchy.length;

    // Manager must have higher authority than target
    if (managerLevel >= targetLevel) {
      return res.status(403).json({
        success: false,
        message: 'You cannot manage users with equal or higher roles',
        error: 'INSUFFICIENT_AUTHORITY'
      });
    }

    req.targetUser = targetUser;
    req.userChurchRole = managerRole;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify church ownership or leadership
 * Used for church management endpoints
 */
const requireChurchOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
    }

    // System admins can manage any church
    if (req.user.systemRole === SYSTEM_ROLES.SYSTEM_ADMIN) {
      return next();
    }

    const churchId = req.params.churchId || req.params.id;

    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required',
        error: 'CHURCH_REQUIRED'
      });
    }

    const church = await Church.findById(churchId);

    if (!church) {
      return res.status(404).json({
        success: false,
        message: 'Church not found',
        error: 'CHURCH_NOT_FOUND'
      });
    }

    // Check if user is in church leadership
    const isLeader = church.leadership.some(
      l => l.user.toString() === req.user._id.toString()
    );

    // Or check if user is admin/pastor in the church
    const isAdmin = req.user.isChurchAdmin(churchId);

    if (!isLeader && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to manage this church',
        error: 'NOT_CHURCH_LEADER'
      });
    }

    req.church = church;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  attachUser,
  requireUser,
  requireSystemAdmin,
  attachChurchContext,
  requireChurchRole,
  requireChurchAdmin,
  requireChurchLeader,
  requireChurchMember,
  canManageChurchMember,
  requireChurchOwnership,
  getChurchIdFromRequest
};
