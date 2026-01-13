const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { checkJwt } = require('../config/auth0');
const {
  attachUser,
  requireUser,
  requireChurchAdmin,
  requireSystemAdmin,
  canManageChurchMember
} = require('../middlewares/churchPermissions');
const validateRequest = require('../middlewares/validateRequest');
const { body, param, query } = require('express-validator');

// All routes require authentication
router.use(checkJwt);
router.use(attachUser);
router.use(requireUser);

// ============ User Routes ============

// Request to join a church
router.post('/request',
  [
    body('churchId').isMongoId().withMessage('Valid church ID is required'),
    body('message').optional().isString().isLength({ max: 500 })
  ],
  validateRequest,
  membershipController.requestMembership
);

// Get current user's memberships
router.get('/my', membershipController.getMyMemberships);

// Leave a church
router.delete('/churches/:churchId/leave',
  [param('churchId').isMongoId().withMessage('Valid church ID is required')],
  validateRequest,
  membershipController.leaveChurch
);

// ============ Church Admin Routes ============

// Get pending membership requests
router.get('/churches/:churchId/pending',
  [param('churchId').isMongoId().withMessage('Valid church ID is required')],
  validateRequest,
  requireChurchAdmin,
  membershipController.getPendingRequests
);

// Approve membership request
router.put('/churches/:churchId/approve/:userId',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    param('userId').isMongoId().withMessage('Valid user ID is required'),
    body('role').optional().isIn(['admin', 'pastor', 'leader', 'member', 'visitor'])
      .withMessage('Invalid role')
  ],
  validateRequest,
  requireChurchAdmin,
  membershipController.approveMembership
);

// Reject membership request
router.put('/churches/:churchId/reject/:userId',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    param('userId').isMongoId().withMessage('Valid user ID is required'),
    body('reason').optional().isString().isLength({ max: 500 })
  ],
  validateRequest,
  requireChurchAdmin,
  membershipController.rejectMembership
);

// Get church members
router.get('/churches/:churchId/members',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['admin', 'pastor', 'leader', 'member', 'visitor']),
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended']),
    query('search').optional().isString()
  ],
  validateRequest,
  requireChurchAdmin,
  membershipController.getChurchMembers
);

// Update member role
router.put('/churches/:churchId/members/:userId/role',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    param('userId').isMongoId().withMessage('Valid user ID is required'),
    body('role').isIn(['admin', 'pastor', 'leader', 'member', 'visitor'])
      .withMessage('Valid role is required')
  ],
  validateRequest,
  requireChurchAdmin,
  canManageChurchMember,
  membershipController.updateMemberRole
);

// Remove member from church
router.delete('/churches/:churchId/members/:userId',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    param('userId').isMongoId().withMessage('Valid user ID is required')
  ],
  validateRequest,
  requireChurchAdmin,
  canManageChurchMember,
  membershipController.removeMember
);

// ============ Leadership Routes ============

// Get church leadership (public within church)
router.get('/churches/:churchId/leadership',
  [param('churchId').isMongoId().withMessage('Valid church ID is required')],
  validateRequest,
  membershipController.getLeadership
);

// Add leader (system admin or church admin only)
router.post('/churches/:churchId/leadership',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('role').isIn(['senior_pastor', 'pastor', 'elder', 'deacon', 'admin'])
      .withMessage('Valid leadership role is required'),
    body('title').optional().isString().isLength({ max: 100 }),
    body('isPrimary').optional().isBoolean()
  ],
  validateRequest,
  requireChurchAdmin,
  membershipController.addLeader
);

// Remove leader
router.delete('/churches/:churchId/leadership/:userId',
  [
    param('churchId').isMongoId().withMessage('Valid church ID is required'),
    param('userId').isMongoId().withMessage('Valid user ID is required')
  ],
  validateRequest,
  requireSystemAdmin, // Only system admin can remove leaders
  membershipController.removeLeader
);

module.exports = router;
