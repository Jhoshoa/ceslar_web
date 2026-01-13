const Sermon = require('../models/Sermon');
const { NotFoundError } = require('../commons/errors');
const { getPagination, getSorting, buildPaginationResult } = require('../helpers/pagination');
const { SERMON_VISIBILITY } = require('../commons/constants');

class SermonService {
  async createSermon(sermonData) {
    const sermon = new Sermon(sermonData);
    await sermon.save();
    return sermon;
  }

  async getSermonById(id, incrementView = false) {
    const sermon = await Sermon.findById(id)
      .populate('church', 'name slug city country')
      .populate('speaker', 'firstName lastName avatar');

    if (!sermon) {
      throw new NotFoundError('Sermon not found');
    }

    if (incrementView) {
      sermon.viewCount += 1;
      await sermon.save();
    }

    return sermon;
  }

  async getSermonBySlug(slug, incrementView = false) {
    const sermon = await Sermon.findOne({ slug })
      .populate('church', 'name slug city country')
      .populate('speaker', 'firstName lastName avatar');

    if (!sermon) {
      throw new NotFoundError('Sermon not found');
    }

    if (incrementView) {
      sermon.viewCount += 1;
      await sermon.save();
    }

    return sermon;
  }

  async updateSermon(id, updateData) {
    const sermon = await Sermon.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!sermon) {
      throw new NotFoundError('Sermon not found');
    }

    return sermon;
  }

  async deleteSermon(id) {
    const sermon = await Sermon.findByIdAndDelete(id);

    if (!sermon) {
      throw new NotFoundError('Sermon not found');
    }

    return sermon;
  }

  // Build church visibility filter
  _buildChurchFilter(query) {
    const filter = {};

    if (query.church) {
      filter.$or = [
        { church: query.church },
        { sermonVisibility: SERMON_VISIBILITY.NETWORK_WIDE }
      ];
    }

    if (query.sermonVisibility) {
      filter.sermonVisibility = query.sermonVisibility;
    }

    return filter;
  }

  async listSermons(query, isMember = false) {
    const { page, limit, skip } = getPagination(query);
    const sort = getSorting(query, '-date');

    const filter = { isPublished: true, ...this._buildChurchFilter(query) };

    if (!isMember) {
      filter.membersOnly = false;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.speaker) {
      filter.speaker = query.speaker;
    }

    if (query.series) {
      filter['series.name'] = query.series;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const [sermons, total] = await Promise.all([
      Sermon.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('church', 'name slug city')
        .populate('speaker', 'firstName lastName'),
      Sermon.countDocuments(filter)
    ]);

    return {
      sermons,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async getLatestSermon(churchId = null) {
    const filter = {
      isPublished: true,
      membersOnly: false
    };

    // Include network-wide sermons or filter by church
    if (churchId) {
      filter.$or = [
        { church: churchId },
        { sermonVisibility: SERMON_VISIBILITY.NETWORK_WIDE }
      ];
    }

    const sermon = await Sermon.findOne(filter)
      .sort('-date')
      .populate('church', 'name slug city')
      .populate('speaker', 'firstName lastName');

    return sermon;
  }

  async getFeaturedSermons(limit = 3, churchId = null) {
    const filter = {
      isPublished: true,
      membersOnly: false,
      isFeatured: true
    };

    if (churchId) {
      filter.$or = [
        { church: churchId },
        { sermonVisibility: SERMON_VISIBILITY.NETWORK_WIDE }
      ];
    }

    const sermons = await Sermon.find(filter)
      .sort('-date')
      .limit(limit)
      .populate('church', 'name slug city')
      .populate('speaker', 'firstName lastName');

    return sermons;
  }

  async getSermonsByChurch(churchId, query = {}) {
    const { page, limit, skip } = getPagination(query);

    const filter = {
      church: churchId,
      isPublished: true
    };

    if (query.membersOnly === 'false') {
      filter.membersOnly = false;
    }

    const [sermons, total] = await Promise.all([
      Sermon.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('speaker', 'firstName lastName'),
      Sermon.countDocuments(filter)
    ]);

    return {
      sermons,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async getSermonSeries(churchId = null) {
    const match = { isPublished: true, 'series.name': { $exists: true, $ne: '' } };

    if (churchId) {
      match.$or = [
        { church: churchId },
        { sermonVisibility: SERMON_VISIBILITY.NETWORK_WIDE }
      ];
    }

    const series = await Sermon.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$series.name',
          sermonCount: { $sum: 1 },
          latestDate: { $max: '$date' },
          thumbnail: { $first: '$media.thumbnailUrl' }
        }
      },
      { $sort: { latestDate: -1 } }
    ]);

    return series;
  }

  async getSermonTags(churchId = null) {
    const match = { isPublished: true };

    if (churchId) {
      match.$or = [
        { church: churchId },
        { sermonVisibility: SERMON_VISIBILITY.NETWORK_WIDE }
      ];
    }

    const tags = await Sermon.aggregate([
      { $match: match },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    return tags;
  }
}

module.exports = new SermonService();
