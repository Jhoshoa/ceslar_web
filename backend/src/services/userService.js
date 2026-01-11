const User = require('../models/User');
const { NotFoundError, ConflictError } = require('../commons/errors');
const { getPagination, getSorting, buildPaginationResult } = require('../helpers/pagination');

class UserService {
  async createUser(userData) {
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { auth0Id: userData.auth0Id }
      ]
    });

    if (existingUser) {
      throw new ConflictError('User with this email or auth0Id already exists');
    }

    const user = new User(userData);
    await user.save();
    return user;
  }

  async getUserById(id) {
    const user = await User.findById(id)
      .populate('ministries', 'name type')
      .populate('smallGroups', 'name type');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async getUserByAuth0Id(auth0Id) {
    const user = await User.findOne({ auth0Id })
      .populate('ministries', 'name type')
      .populate('smallGroups', 'name type');

    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
  }

  async updateUser(id, updateData) {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async listUsers(query) {
    const { page, limit, skip } = getPagination(query);
    const sort = getSorting(query, '-createdAt');

    const filter = {};

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isMember !== undefined) {
      filter.isMember = query.isMember === 'true';
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-auth0Id'),
      User.countDocuments(filter)
    ]);

    return {
      users,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async getDirectoryMembers(query) {
    const { page, limit, skip } = getPagination(query);

    const filter = {
      isMember: true,
      isActive: true,
      'preferences.showInDirectory': true
    };

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const [members, total] = await Promise.all([
      User.find(filter)
        .sort('lastName firstName')
        .skip(skip)
        .limit(limit)
        .select('firstName lastName email phone avatar'),
      User.countDocuments(filter)
    ]);

    return {
      members,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async updateLastLogin(auth0Id) {
    await User.findOneAndUpdate(
      { auth0Id },
      { $set: { lastLogin: new Date() } }
    );
  }
}

module.exports = new UserService();
