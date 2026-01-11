const eventService = require('../services/eventService');
const userService = require('../services/userService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

const eventController = {
  // Create event (staff/admin)
  createEvent: asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.body);
    ResponseHandler.created(res, event, 'Event created successfully');
  }),

  // Get event by ID
  getEvent: asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(req.params.id);
    ResponseHandler.success(res, event);
  }),

  // Get event by slug (public)
  getEventBySlug: asyncHandler(async (req, res) => {
    const event = await eventService.getEventBySlug(req.params.slug);
    ResponseHandler.success(res, event);
  }),

  // Update event (staff/admin)
  updateEvent: asyncHandler(async (req, res) => {
    const event = await eventService.updateEvent(req.params.id, req.body);
    ResponseHandler.success(res, event, 'Event updated successfully');
  }),

  // Delete event (admin)
  deleteEvent: asyncHandler(async (req, res) => {
    await eventService.deleteEvent(req.params.id);
    ResponseHandler.success(res, null, 'Event deleted successfully');
  }),

  // List events with filters
  listEvents: asyncHandler(async (req, res) => {
    const { events, pagination } = await eventService.listEvents(req.query);
    ResponseHandler.paginated(res, events, pagination);
  }),

  // Get upcoming events (public)
  getUpcomingEvents: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 5;
    const events = await eventService.getUpcomingEvents(limit);
    ResponseHandler.success(res, events);
  }),

  // Get featured events (public)
  getFeaturedEvents: asyncHandler(async (req, res) => {
    const events = await eventService.getFeaturedEvents();
    ResponseHandler.success(res, events);
  }),

  // Register for event (authenticated)
  registerForEvent: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const event = await eventService.registerForEvent(req.params.id, user._id);
    ResponseHandler.success(res, event, 'Successfully registered for event');
  }),

  // Cancel event registration (authenticated)
  cancelRegistration: asyncHandler(async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    const event = await eventService.cancelRegistration(req.params.id, user._id);
    ResponseHandler.success(res, event, 'Registration cancelled successfully');
  })
};

module.exports = eventController;
