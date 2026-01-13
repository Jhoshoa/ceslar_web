const membershipService = require('../services/membershipService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

const membershipController = {
  /**
   * Request to join a church
   * POST /api/memberships/request
   */
  requestMembership: asyncHandler(async (req, res) => {
    const { churchId, message } = req.body;
    const result = await membershipService.requestMembership(
      req.user._id,
      churchId,
      message
    );

    const responseMessage = result.requiresApproval
      ? 'Membership request submitted. Waiting for approval.'
      : 'Welcome! You are now a member of this church.';

    ResponseHandler.created(res, {
      requiresApproval: result.requiresApproval,
      church: {
        _id: result.church._id,
        name: result.church.name
      }
    }, responseMessage);
  }),

  /**
   * Get pending membership requests for a church
   * GET /api/memberships/churches/:churchId/pending
   */
  getPendingRequests: asyncHandler(async (req, res) => {
    const { churchId } = req.params;
    const { page, limit } = req.query;

    const result = await membershipService.getPendingRequests(churchId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    });

    ResponseHandler.paginated(res, result.requests, result.pagination);
  }),

  /**
   * Approve a membership request
   * PUT /api/memberships/churches/:churchId/approve/:userId
   */
  approveMembership: asyncHandler(async (req, res) => {
    const { churchId, userId } = req.params;
    const { role } = req.body;

    const user = await membershipService.approveMembership(
      churchId,
      userId,
      req.user._id,
      role
    );

    ResponseHandler.success(res, {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    }, 'Membership approved successfully');
  }),

  /**
   * Reject a membership request
   * PUT /api/memberships/churches/:churchId/reject/:userId
   */
  rejectMembership: asyncHandler(async (req, res) => {
    const { churchId, userId } = req.params;
    const { reason } = req.body;

    await membershipService.rejectMembership(
      churchId,
      userId,
      req.user._id,
      reason
    );

    ResponseHandler.success(res, null, 'Membership request rejected');
  }),

  /**
   * Update a member's role
   * PUT /api/memberships/churches/:churchId/members/:userId/role
   */
  updateMemberRole: asyncHandler(async (req, res) => {
    const { churchId, userId } = req.params;
    const { role } = req.body;

    const user = await membershipService.updateMemberRole(
      churchId,
      userId,
      role,
      req.user._id
    );

    ResponseHandler.success(res, {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      newRole: role
    }, 'Member role updated successfully');
  }),

  /**
   * Remove a member from church
   * DELETE /api/memberships/churches/:churchId/members/:userId
   */
  removeMember: asyncHandler(async (req, res) => {
    const { churchId, userId } = req.params;

    await membershipService.removeMember(churchId, userId, req.user._id);

    ResponseHandler.success(res, null, 'Member removed from church');
  }),

  /**
   * Get church members
   * GET /api/memberships/churches/:churchId/members
   */
  getChurchMembers: asyncHandler(async (req, res) => {
    const { churchId } = req.params;
    const { page, limit, role, status, search } = req.query;

    const result = await membershipService.getChurchMembers(churchId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      role,
      status,
      search
    });

    ResponseHandler.paginated(res, result.members, result.pagination);
  }),

  /**
   * Get current user's memberships
   * GET /api/memberships/my
   */
  getMyMemberships: asyncHandler(async (req, res) => {
    const memberships = await membershipService.getUserMemberships(req.user._id);
    ResponseHandler.success(res, memberships);
  }),

  /**
   * Leave a church (self-removal)
   * DELETE /api/memberships/churches/:churchId/leave
   */
  leaveChurch: asyncHandler(async (req, res) => {
    const { churchId } = req.params;

    await membershipService.removeMember(churchId, req.user._id, req.user._id);

    ResponseHandler.success(res, null, 'You have left the church');
  }),

  // ============ Leadership Management ============

  /**
   * Add a leader to church
   * POST /api/memberships/churches/:churchId/leadership
   */
  addLeader: asyncHandler(async (req, res) => {
    const { churchId } = req.params;
    const { userId, role, title, isPrimary } = req.body;

    const church = await membershipService.addChurchLeader(
      churchId,
      userId,
      role,
      title,
      req.user._id,
      isPrimary
    );

    ResponseHandler.success(res, {
      leadership: church.leadership
    }, 'Leader added successfully');
  }),

  /**
   * Remove a leader from church
   * DELETE /api/memberships/churches/:churchId/leadership/:userId
   */
  removeLeader: asyncHandler(async (req, res) => {
    const { churchId, userId } = req.params;

    const church = await membershipService.removeChurchLeader(
      churchId,
      userId,
      req.user._id
    );

    ResponseHandler.success(res, {
      leadership: church.leadership
    }, 'Leader removed successfully');
  }),

  /**
   * Get church leadership
   * GET /api/memberships/churches/:churchId/leadership
   */
  getLeadership: asyncHandler(async (req, res) => {
    const { churchId } = req.params;

    const leadership = await membershipService.getChurchLeadership(churchId);

    ResponseHandler.success(res, leadership);
  })
};

module.exports = membershipController;
