const Ministry = require('../models/Ministry');
const { NotFoundError } = require('../commons/errors');
const { MINISTRY_SCOPE } = require('../commons/constants');

class MinistryService {
  async createMinistry(ministryData) {
    const ministry = new Ministry(ministryData);
    await ministry.save();
    return ministry;
  }

  async getMinistryById(id) {
    const ministry = await Ministry.findById(id)
      .populate('church', 'name slug city country')
      .populate('leader', 'firstName lastName email avatar')
      .populate('members', 'firstName lastName avatar');

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    return ministry;
  }

  async getMinistryBySlug(slug) {
    const ministry = await Ministry.findOne({ slug })
      .populate('church', 'name slug city country')
      .populate('leader', 'firstName lastName email avatar');

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    return ministry;
  }

  async updateMinistry(id, updateData) {
    const ministry = await Ministry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    return ministry;
  }

  async deleteMinistry(id) {
    const ministry = await Ministry.findByIdAndDelete(id);

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    return ministry;
  }

  // Build church scope filter
  _buildChurchFilter(query) {
    const filter = {};

    if (query.church) {
      filter.$or = [
        { church: query.church },
        { scope: MINISTRY_SCOPE.GLOBAL }
      ];
    }

    if (query.scope) {
      filter.scope = query.scope;
    }

    return filter;
  }

  async listMinistries(query = {}) {
    const filter = { isActive: true, ...this._buildChurchFilter(query) };

    if (query.type) {
      filter.type = query.type;
    }

    if (query.featured === 'true') {
      filter.isFeatured = true;
    }

    const ministries = await Ministry.find(filter)
      .sort('displayOrder name')
      .populate('church', 'name slug city')
      .populate('leader', 'firstName lastName');

    return ministries;
  }

  async getFeaturedMinistries(churchId = null) {
    const filter = {
      isActive: true,
      isFeatured: true
    };

    if (churchId) {
      filter.$or = [
        { church: churchId },
        { scope: MINISTRY_SCOPE.GLOBAL }
      ];
    }

    const ministries = await Ministry.find(filter)
      .sort('displayOrder')
      .limit(6)
      .populate('church', 'name slug city')
      .populate('leader', 'firstName lastName');

    return ministries;
  }

  async getMinistriesByChurch(churchId, query = {}) {
    const filter = {
      $or: [
        { church: churchId },
        { scope: MINISTRY_SCOPE.GLOBAL }
      ],
      isActive: true
    };

    if (query.type) {
      filter.type = query.type;
    }

    const ministries = await Ministry.find(filter)
      .sort('displayOrder name')
      .populate('leader', 'firstName lastName');

    return ministries;
  }

  async joinMinistry(ministryId, userId) {
    const ministry = await Ministry.findById(ministryId);

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    const isAlreadyMember = ministry.members.includes(userId);

    if (!isAlreadyMember) {
      ministry.members.push(userId);
      await ministry.save();
    }

    return ministry;
  }

  async leaveMinistry(ministryId, userId) {
    const ministry = await Ministry.findById(ministryId);

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    ministry.members = ministry.members.filter(
      m => m.toString() !== userId
    );

    await ministry.save();
    return ministry;
  }
}

module.exports = new MinistryService();
