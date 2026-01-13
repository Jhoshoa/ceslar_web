const Event = require('../models/Event');
const { NotFoundError, BadRequestError } = require('../commons/errors');
const { getPagination, getSorting, buildPaginationResult } = require('../helpers/pagination');
const { VISIBILITY_LEVELS } = require('../commons/constants');

class EventService {
  async createEvent(eventData) {
    const event = new Event(eventData);
    await event.save();
    return event;
  }

  async getEventById(id) {
    const event = await Event.findById(id)
      .populate('church', 'name slug city country')
      .populate('ministry', 'name type')
      .populate('organizer', 'firstName lastName email');

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return event;
  }

  async getEventBySlug(slug) {
    const event = await Event.findOne({ slug })
      .populate('church', 'name slug city country')
      .populate('ministry', 'name type')
      .populate('organizer', 'firstName lastName email');

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return event;
  }

  async updateEvent(id, updateData) {
    const event = await Event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return event;
  }

  async deleteEvent(id) {
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return event;
  }

  // Build church visibility filter for public queries
  _buildChurchFilter(query) {
    const filter = {};

    // Filter by specific church
    if (query.church) {
      filter.$or = [
        { church: query.church },
        { sharedWithChurches: query.church },
        { visibility: VISIBILITY_LEVELS.GLOBAL }
      ];
    }

    // Filter by visibility level
    if (query.visibility) {
      filter.visibility = query.visibility;
    }

    return filter;
  }

  async listEvents(query) {
    const { page, limit, skip } = getPagination(query);
    const sort = getSorting(query, 'startDate');

    const filter = { ...this._buildChurchFilter(query) };

    if (query.type) {
      filter.type = query.type;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.isPublic !== undefined) {
      filter.isPublic = query.isPublic === 'true';
    }

    if (query.upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
      filter.status = 'published';
    }

    if (query.ministry) {
      filter.ministry = query.ministry;
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('church', 'name slug city')
        .populate('ministry', 'name'),
      Event.countDocuments(filter)
    ]);

    return {
      events,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async getUpcomingEvents(limit = 5, churchId = null) {
    const filter = {
      startDate: { $gte: new Date() },
      status: 'published',
      isPublic: true
    };

    // Filter by church or include global events
    if (churchId) {
      filter.$or = [
        { church: churchId },
        { sharedWithChurches: churchId },
        { visibility: VISIBILITY_LEVELS.GLOBAL }
      ];
    }

    const events = await Event.find(filter)
      .sort('startDate')
      .limit(limit)
      .populate('church', 'name slug city')
      .populate('ministry', 'name');

    return events;
  }

  async getFeaturedEvents(churchId = null) {
    const filter = {
      startDate: { $gte: new Date() },
      status: 'published',
      isPublic: true,
      isFeatured: true
    };

    if (churchId) {
      filter.$or = [
        { church: churchId },
        { sharedWithChurches: churchId },
        { visibility: VISIBILITY_LEVELS.GLOBAL }
      ];
    }

    const events = await Event.find(filter)
      .sort('startDate')
      .limit(3)
      .populate('church', 'name slug city');

    return events;
  }

  async getEventsByChurch(churchId, query = {}) {
    const { page, limit, skip } = getPagination(query);

    const filter = {
      $or: [
        { church: churchId },
        { sharedWithChurches: churchId }
      ]
    };

    if (query.upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
      filter.status = 'published';
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .populate('ministry', 'name'),
      Event.countDocuments(filter)
    ]);

    return {
      events,
      pagination: buildPaginationResult(page, limit, total)
    };
  }

  async registerForEvent(eventId, userId) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (!event.registration.required) {
      throw new BadRequestError('This event does not require registration');
    }

    const isAlreadyRegistered = event.attendees.some(
      a => a.user.toString() === userId
    );

    if (isAlreadyRegistered) {
      throw new BadRequestError('Already registered for this event');
    }

    const isFull = event.registration.maxAttendees &&
      event.registration.currentAttendees >= event.registration.maxAttendees;

    const status = isFull && event.registration.waitlistEnabled ? 'waitlisted' : 'registered';

    if (isFull && !event.registration.waitlistEnabled) {
      throw new BadRequestError('Event is full');
    }

    event.attendees.push({ user: userId, status });
    if (status === 'registered') {
      event.registration.currentAttendees += 1;
    }

    await event.save();
    return event;
  }

  async cancelRegistration(eventId, userId) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const attendeeIndex = event.attendees.findIndex(
      a => a.user.toString() === userId
    );

    if (attendeeIndex === -1) {
      throw new BadRequestError('Not registered for this event');
    }

    const wasRegistered = event.attendees[attendeeIndex].status === 'registered';
    event.attendees.splice(attendeeIndex, 1);

    if (wasRegistered) {
      event.registration.currentAttendees -= 1;
    }

    await event.save();
    return event;
  }
}

module.exports = new EventService();
