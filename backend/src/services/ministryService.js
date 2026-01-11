const Ministry = require('../models/Ministry');
const { NotFoundError } = require('../commons/errors');

class MinistryService {
  async createMinistry(ministryData) {
    const ministry = new Ministry(ministryData);
    await ministry.save();
    return ministry;
  }

  async getMinistryById(id) {
    const ministry = await Ministry.findById(id)
      .populate('leader', 'firstName lastName email avatar')
      .populate('members', 'firstName lastName avatar');

    if (!ministry) {
      throw new NotFoundError('Ministry not found');
    }

    return ministry;
  }

  async getMinistryBySlug(slug) {
    const ministry = await Ministry.findOne({ slug })
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

  async listMinistries(query = {}) {
    const filter = { isActive: true };

    if (query.type) {
      filter.type = query.type;
    }

    if (query.featured === 'true') {
      filter.isFeatured = true;
    }

    const ministries = await Ministry.find(filter)
      .sort('displayOrder name')
      .populate('leader', 'firstName lastName');

    return ministries;
  }

  async getFeaturedMinistries() {
    const ministries = await Ministry.find({
      isActive: true,
      isFeatured: true
    })
      .sort('displayOrder')
      .limit(6)
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
