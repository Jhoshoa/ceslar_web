const Sermon = require('../models/Sermon');
const { NotFoundError } = require('../commons/errors');
const { getPagination, getSorting, buildPaginationResult } = require('../helpers/pagination');

class SermonService {
  async createSermon(sermonData) {
    const sermon = new Sermon(sermonData);
    await sermon.save();
    return sermon;
  }

  async getSermonById(id, incrementView = false) {
    const sermon = await Sermon.findById(id)
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

  async listSermons(query, isMember = false) {
    const { page, limit, skip } = getPagination(query);
    const sort = getSorting(query, '-date');

    const filter = { isPublished: true };

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
        .populate('speaker', 'firstName lastName'),
      Sermon.countDocuments(filter)
    ]);

    return {
      sermons,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async getLatestSermon() {
    const sermon = await Sermon.findOne({
      isPublished: true,
      membersOnly: false
    })
      .sort('-date')
      .populate('speaker', 'firstName lastName');

    return sermon;
  }

  async getFeaturedSermons(limit = 3) {
    const sermons = await Sermon.find({
      isPublished: true,
      membersOnly: false,
      isFeatured: true
    })
      .sort('-date')
      .limit(limit)
      .populate('speaker', 'firstName lastName');

    return sermons;
  }

  async getSermonSeries() {
    const series = await Sermon.aggregate([
      { $match: { isPublished: true, 'series.name': { $exists: true, $ne: '' } } },
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

  async getSermonTags() {
    const tags = await Sermon.aggregate([
      { $match: { isPublished: true } },
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
