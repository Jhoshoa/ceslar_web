const Church = require('../models/Church');
const { NotFoundError, ValidationError } = require('../commons/errors');
const { CHURCH_STATUS, CHURCH_LEVELS } = require('../commons/constants');
const { paginate } = require('../helpers/pagination');

class ChurchService {
  async createChurch(churchData, createdBy) {
    const church = new Church({
      ...churchData,
      createdBy,
    });
    await church.save();
    return church;
  }

  async getChurchById(id) {
    const church = await Church.findById(id)
      .populate('parentChurch', 'name slug country city')
      .populate('leadership.user', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName');

    if (!church) {
      throw new NotFoundError('Church not found');
    }

    return church;
  }

  async getChurchBySlug(slug) {
    const church = await Church.findOne({ slug })
      .populate('parentChurch', 'name slug country city')
      .populate('leadership.user', 'firstName lastName email avatar');

    if (!church) {
      throw new NotFoundError('Church not found');
    }

    return church;
  }

  async updateChurch(id, updateData) {
    const church = await Church.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!church) {
      throw new NotFoundError('Church not found');
    }

    return church;
  }

  async deleteChurch(id) {
    // Check if church has children
    const hasChildren = await Church.exists({ parentChurch: id });
    if (hasChildren) {
      throw new ValidationError('Cannot delete church with child churches');
    }

    const church = await Church.findByIdAndDelete(id);

    if (!church) {
      throw new NotFoundError('Church not found');
    }

    return church;
  }

  async listChurches(query = {}, options = {}) {
    const filter = {};

    // Status filter (default to active for public queries)
    if (query.status) {
      filter.status = query.status;
    } else if (!query.includeInactive) {
      filter.status = CHURCH_STATUS.ACTIVE;
    }

    // Country filter
    if (query.country) {
      filter.country = query.country;
    }

    // Department filter
    if (query.department) {
      filter.department = query.department;
    }

    // City filter
    if (query.city) {
      filter.city = query.city;
    }

    // Level filter
    if (query.level) {
      filter.level = query.level;
    }

    // Headquarters filter
    if (query.isHeadquarters === 'true') {
      filter.isHeadquarters = true;
    }

    // Parent church filter
    if (query.parentChurch) {
      filter.parentChurch = query.parentChurch;
    } else if (query.topLevel === 'true') {
      filter.parentChurch = null;
    }

    // Text search
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const sortOptions = {
      default: { country: 1, department: 1, city: 1, name: 1 },
      name: { name: 1 },
      newest: { createdAt: -1 },
      members: { 'stats.memberCount': -1 },
    };

    const sort = sortOptions[query.sort] || sortOptions.default;

    const result = await paginate(
      Church,
      filter,
      {
        page: options.page || 1,
        limit: options.limit || 20,
        sort,
        populate: [
          { path: 'parentChurch', select: 'name slug' },
        ],
      }
    );

    return result;
  }

  async getHeadquarters() {
    const headquarters = await Church.findOne({ isHeadquarters: true })
      .populate('leadership.user', 'firstName lastName email avatar');

    return headquarters;
  }

  async getChurchesByCountry(country) {
    return Church.getByCountry(country);
  }

  async getChurchesGroupedByLocation() {
    return Church.getGroupedByLocation();
  }

  async getChurchHierarchy(churchId) {
    return Church.getHierarchy(churchId);
  }

  async getChildChurches(parentId) {
    return Church.find({ parentChurch: parentId, status: CHURCH_STATUS.ACTIVE })
      .sort({ level: 1, name: 1 })
      .populate('leadership.user', 'firstName lastName');
  }

  async getAvailableCountries() {
    const countries = await Church.distinct('country', {
      status: CHURCH_STATUS.ACTIVE,
    });
    return countries.sort();
  }

  async getDepartmentsByCountry(country) {
    const departments = await Church.distinct('department', {
      country,
      status: CHURCH_STATUS.ACTIVE,
    });
    return departments.filter(Boolean).sort();
  }

  async getCitiesByDepartment(country, department) {
    const cities = await Church.distinct('city', {
      country,
      department,
      status: CHURCH_STATUS.ACTIVE,
    });
    return cities.sort();
  }

  async addLeadership(churchId, leadershipData, assignedBy) {
    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    church.leadership.push({
      ...leadershipData,
      assignedBy,
      assignedAt: new Date(),
    });

    await church.save();
    return church;
  }

  async removeLeadership(churchId, leadershipId) {
    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    church.leadership = church.leadership.filter(
      (l) => l._id.toString() !== leadershipId
    );

    await church.save();
    return church;
  }

  async updateChurchStatus(churchId, status, verifiedBy) {
    const update = { status };

    if (status === CHURCH_STATUS.ACTIVE) {
      update.verifiedAt = new Date();
      update.verifiedBy = verifiedBy;
    }

    const church = await Church.findByIdAndUpdate(
      churchId,
      { $set: update },
      { new: true }
    );

    if (!church) {
      throw new NotFoundError('Church not found');
    }

    return church;
  }

  async addGalleryImage(churchId, imageData, uploadedBy) {
    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    church.gallery.push({
      ...imageData,
      uploadedBy,
      uploadedAt: new Date(),
    });

    await church.save();
    return church;
  }

  async removeGalleryImage(churchId, imageIndex) {
    const church = await Church.findById(churchId);
    if (!church) {
      throw new NotFoundError('Church not found');
    }

    if (imageIndex >= 0 && imageIndex < church.gallery.length) {
      church.gallery.splice(imageIndex, 1);
      await church.save();
    }

    return church;
  }

  async updateStats(churchId, stats) {
    return Church.findByIdAndUpdate(
      churchId,
      { $set: { stats } },
      { new: true }
    );
  }

  async getNearbyChurches(lat, lng, maxDistanceKm = 50) {
    // Simple distance calculation using coordinates
    // For production, consider using MongoDB's geospatial queries with 2dsphere index
    const churches = await Church.find({
      status: CHURCH_STATUS.ACTIVE,
      'coordinates.lat': { $exists: true },
      'coordinates.lng': { $exists: true },
    });

    // Calculate distance and filter
    const nearbyChurches = churches
      .map((church) => {
        const distance = this.calculateDistance(
          lat,
          lng,
          church.coordinates.lat,
          church.coordinates.lng
        );
        return { church, distance };
      })
      .filter(({ distance }) => distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance)
      .map(({ church, distance }) => ({
        ...church.toObject(),
        distance: Math.round(distance * 10) / 10,
      }));

    return nearbyChurches;
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }
}

module.exports = new ChurchService();
