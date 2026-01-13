const User = require('../models/User');
const Church = require('../models/Church');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../commons/errors');
const { MEMBERSHIP_STATUS, CHURCH_ROLES } = require('../commons/constants');

class MembershipService {
  /**
   * Request to join a church
   */
  async requestMembership(userId, churchId, message = '') {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    // Check if church allows member registration
    if (!church.settings?.allowMemberRegistration) {
      throw new BadRequestError('This church is not accepting new members at this time');
    }

    // Check if user already has a membership (pending or approved)
    const existingMembership = user.churchMemberships.find(
      m => m.church.toString() === churchId.toString()
    );

    if (existingMembership) {
      if (existingMembership.status === MEMBERSHIP_STATUS.APPROVED) {
        throw new BadRequestError('You are already a member of this church');
      }
      if (existingMembership.status === MEMBERSHIP_STATUS.PENDING) {
        throw new BadRequestError('You already have a pending membership request');
      }
      if (existingMembership.status === MEMBERSHIP_STATUS.REJECTED) {
        // Allow re-application after rejection
        existingMembership.status = MEMBERSHIP_STATUS.PENDING;
        existingMembership.joinedAt = new Date();
        existingMembership.role = CHURCH_ROLES.VISITOR;
        await user.save();
        return { user, church, isReapplication: true };
      }
    }

    // Add new membership request
    user.churchMemberships.push({
      church: churchId,
      role: CHURCH_ROLES.VISITOR,
      status: church.settings?.requireApproval ? MEMBERSHIP_STATUS.PENDING : MEMBERSHIP_STATUS.APPROVED,
      joinedAt: new Date()
    });

    // Set as primary church if user doesn't have one
    if (!user.primaryChurch) {
      user.primaryChurch = churchId;
    }

    await user.save();

    return { user, church, requiresApproval: church.settings?.requireApproval };
  }

  /**
   * Get pending membership requests for a church
   */
  async getPendingRequests(churchId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const users = await User.find({
      'churchMemberships.church': churchId,
      'churchMemberships.status': MEMBERSHIP_STATUS.PENDING
    })
      .select('firstName lastName email avatar phone churchMemberships createdAt')
      .skip(skip)
      .limit(limit)
      .sort({ 'churchMemberships.joinedAt': -1 });

    const total = await User.countDocuments({
      'churchMemberships.church': churchId,
      'churchMemberships.status': MEMBERSHIP_STATUS.PENDING
    });

    // Filter to only include the relevant membership
    const requests = users.map(user => {
      const membership = user.churchMemberships.find(
        m => m.church.toString() === churchId.toString()
      );
      return {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone
        },
        membership: {
          _id: membership._id,
          joinedAt: membership.joinedAt,
          status: membership.status
        }
      };
    });

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Approve a membership request
   */
  async approveMembership(churchId, userId, approverId, role = CHURCH_ROLES.MEMBER) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const membership = user.churchMemberships.find(
      m => m.church.toString() === churchId.toString()
    );

    if (!membership) {
      throw new NotFoundError('Membership request not found');
    }

    if (membership.status === MEMBERSHIP_STATUS.APPROVED) {
      throw new BadRequestError('Membership is already approved');
    }

    membership.status = MEMBERSHIP_STATUS.APPROVED;
    membership.role = role;
    membership.approvedBy = approverId;
    membership.approvedAt = new Date();

    // Update user's member status
    user.isMember = true;
    if (!user.memberSince) {
      user.memberSince = new Date();
    }

    await user.save();

    // Update church member count
    await Church.findByIdAndUpdate(churchId, {
      $inc: { 'stats.memberCount': 1 }
    });

    return user;
  }

  /**
   * Reject a membership request
   */
  async rejectMembership(churchId, userId, rejectedBy, reason = '') {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const membership = user.churchMemberships.find(
      m => m.church.toString() === churchId.toString()
    );

    if (!membership) {
      throw new NotFoundError('Membership request not found');
    }

    if (membership.status === MEMBERSHIP_STATUS.APPROVED) {
      throw new BadRequestError('Cannot reject an approved membership. Use remove instead.');
    }

    membership.status = MEMBERSHIP_STATUS.REJECTED;
    await user.save();

    return user;
  }

  /**
   * Update a member's role in a church
   */
  async updateMemberRole(churchId, userId, newRole, updatedBy) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const membership = user.churchMemberships.find(
      m => m.church.toString() === churchId.toString() &&
           m.status === MEMBERSHIP_STATUS.APPROVED
    );

    if (!membership) {
      throw new NotFoundError('User is not a member of this church');
    }

    // Validate role
    if (!Object.values(CHURCH_ROLES).includes(newRole)) {
      throw new BadRequestError('Invalid role');
    }

    membership.role = newRole;
    await user.save();

    return user;
  }

  /**
   * Remove a member from a church
   */
  async removeMember(churchId, userId, removedBy) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const membershipIndex = user.churchMemberships.findIndex(
      m => m.church.toString() === churchId.toString()
    );

    if (membershipIndex === -1) {
      throw new NotFoundError('User is not associated with this church');
    }

    const wasApproved = user.churchMemberships[membershipIndex].status === MEMBERSHIP_STATUS.APPROVED;

    // Remove the membership
    user.churchMemberships.splice(membershipIndex, 1);

    // Update primary church if needed
    if (user.primaryChurch?.toString() === churchId.toString()) {
      user.primaryChurch = user.churchMemberships.length > 0
        ? user.churchMemberships[0].church
        : null;
    }

    // Update member status
    const hasOtherMemberships = user.churchMemberships.some(
      m => m.status === MEMBERSHIP_STATUS.APPROVED
    );
    if (!hasOtherMemberships) {
      user.isMember = false;
    }

    await user.save();

    // Update church member count
    if (wasApproved) {
      await Church.findByIdAndUpdate(churchId, {
        $inc: { 'stats.memberCount': -1 }
      });
    }

    return user;
  }

  /**
   * Get members of a church
   */
  async getChurchMembers(churchId, options = {}) {
    const { page = 1, limit = 20, role, status = MEMBERSHIP_STATUS.APPROVED, search } = options;
    const skip = (page - 1) * limit;

    const query = {
      'churchMemberships.church': churchId,
      'churchMemberships.status': status
    };

    if (role) {
      query['churchMemberships.role'] = role;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const users = await User.find(query)
      .select('firstName lastName email avatar phone churchMemberships memberSince')
      .skip(skip)
      .limit(limit)
      .sort({ lastName: 1, firstName: 1 });

    const total = await User.countDocuments(query);

    // Map to include only relevant membership info
    const members = users.map(user => {
      const membership = user.churchMemberships.find(
        m => m.church.toString() === churchId.toString()
      );
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        memberSince: user.memberSince,
        role: membership.role,
        joinedAt: membership.joinedAt,
        status: membership.status
      };
    });

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user's memberships across all churches
   */
  async getUserMemberships(userId) {
    const user = await User.findById(userId)
      .populate({
        path: 'churchMemberships.church',
        select: 'name slug city country logo'
      })
      .populate({
        path: 'churchMemberships.approvedBy',
        select: 'firstName lastName'
      });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.churchMemberships;
  }

  /**
   * Add a leader to church leadership
   */
  async addChurchLeader(churchId, userId, leadershipRole, title, assignedBy, isPrimary = false) {
    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user is already in leadership
    const existingLeader = church.leadership.find(
      l => l.user.toString() === userId.toString()
    );

    if (existingLeader) {
      // Update existing leadership role
      existingLeader.role = leadershipRole;
      existingLeader.title = title;
      existingLeader.isPrimary = isPrimary;
    } else {
      // Add new leader
      church.leadership.push({
        user: userId,
        role: leadershipRole,
        title,
        isPrimary,
        assignedAt: new Date(),
        assignedBy
      });
    }

    // If marked as primary, unmark others
    if (isPrimary) {
      church.leadership.forEach(l => {
        if (l.user.toString() !== userId.toString()) {
          l.isPrimary = false;
        }
      });
    }

    await church.save();

    // Ensure user has admin role in church memberships
    const membership = user.churchMemberships.find(
      m => m.church.toString() === churchId.toString()
    );

    if (membership) {
      if (membership.status !== MEMBERSHIP_STATUS.APPROVED) {
        membership.status = MEMBERSHIP_STATUS.APPROVED;
      }
      // Set role to ADMIN or PASTOR based on leadership role
      if (['senior_pastor', 'pastor'].includes(leadershipRole)) {
        membership.role = CHURCH_ROLES.PASTOR;
      } else {
        membership.role = CHURCH_ROLES.ADMIN;
      }
    } else {
      // Add membership if not exists
      user.churchMemberships.push({
        church: churchId,
        role: ['senior_pastor', 'pastor'].includes(leadershipRole) ? CHURCH_ROLES.PASTOR : CHURCH_ROLES.ADMIN,
        status: MEMBERSHIP_STATUS.APPROVED,
        joinedAt: new Date(),
        approvedBy: assignedBy,
        approvedAt: new Date()
      });
    }

    await user.save();

    return church;
  }

  /**
   * Remove a leader from church leadership
   */
  async removeChurchLeader(churchId, userId, removedBy) {
    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    const leaderIndex = church.leadership.findIndex(
      l => l.user.toString() === userId.toString()
    );

    if (leaderIndex === -1) {
      throw new NotFoundError('User is not in church leadership');
    }

    church.leadership.splice(leaderIndex, 1);
    await church.save();

    return church;
  }

  /**
   * Get church leadership
   */
  async getChurchLeadership(churchId) {
    const church = await Church.findById(churchId)
      .populate({
        path: 'leadership.user',
        select: 'firstName lastName email avatar'
      })
      .populate({
        path: 'leadership.assignedBy',
        select: 'firstName lastName'
      });

    if (!church) {
      throw new NotFoundError('Church not found');
    }

    return church.leadership;
  }
}

module.exports = new MembershipService();
