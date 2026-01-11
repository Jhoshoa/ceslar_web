const eventService = require('../services/eventService');
const sermonService = require('../services/sermonService');
const ministryService = require('../services/ministryService');
const ResponseHandler = require('../helpers/responseHandler');
const asyncHandler = require('../helpers/asyncHandler');

/**
 * Public controller for homepage and public pages data
 */
const publicController = {
  // Get all homepage data in one request
  getHomepageData: asyncHandler(async (req, res) => {
    const [
      upcomingEvents,
      featuredEvents,
      latestSermon,
      featuredSermons,
      featuredMinistries
    ] = await Promise.all([
      eventService.getUpcomingEvents(5),
      eventService.getFeaturedEvents(),
      sermonService.getLatestSermon(),
      sermonService.getFeaturedSermons(3),
      ministryService.getFeaturedMinistries()
    ]);

    const homepageData = {
      upcomingEvents,
      featuredEvents,
      latestSermon,
      featuredSermons,
      featuredMinistries,
      churchInfo: {
        name: 'Our Church',
        tagline: 'A place of faith, hope, and love',
        address: '123 Church Street, Springfield, IL 62701',
        phone: '(555) 123-4567',
        email: 'info@ourchurch.com',
        serviceTimes: [
          { day: 'Sunday', time: '10:00 AM', name: 'Morning Worship' },
          { day: 'Wednesday', time: '7:00 PM', name: 'Bible Study' }
        ],
        socialMedia: {
          facebook: 'https://facebook.com/ourchurch',
          instagram: 'https://instagram.com/ourchurch',
          youtube: 'https://youtube.com/ourchurch'
        }
      }
    };

    ResponseHandler.success(res, homepageData);
  }),

  // Get church info only
  getChurchInfo: asyncHandler(async (req, res) => {
    const churchInfo = {
      name: 'Our Church',
      tagline: 'A place of faith, hope, and love',
      mission: 'To love God, love people, and make disciples.',
      vision: 'To be a community of Christ-followers transforming our city and beyond.',
      address: {
        street: '123 Church Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      phone: '(555) 123-4567',
      email: 'info@ourchurch.com',
      officeHours: 'Monday - Friday, 9:00 AM - 5:00 PM',
      serviceTimes: [
        { day: 'Sunday', time: '10:00 AM', name: 'Morning Worship', description: 'Main worship service with nursery and children\'s church available' },
        { day: 'Wednesday', time: '7:00 PM', name: 'Bible Study', description: 'Mid-week Bible study for all ages' }
      ],
      socialMedia: {
        facebook: 'https://facebook.com/ourchurch',
        instagram: 'https://instagram.com/ourchurch',
        youtube: 'https://youtube.com/ourchurch',
        twitter: 'https://twitter.com/ourchurch'
      }
    };

    ResponseHandler.success(res, churchInfo);
  }),

  // Submit contact form
  submitContactForm: asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Here you would typically send an email or save to database
    // For now, just acknowledge receipt
    console.log('Contact form submission:', { name, email, phone, subject, message });

    ResponseHandler.success(res, null, 'Thank you for your message. We will get back to you soon!');
  }),

  // Submit prayer request (public)
  submitPrayerRequest: asyncHandler(async (req, res) => {
    const { name, email, request, isAnonymous, visibility } = req.body;

    // Here you would save to database
    console.log('Prayer request submission:', { name, email, request, isAnonymous, visibility });

    ResponseHandler.success(res, null, 'Thank you for sharing your prayer request. Our prayer team will be praying for you.');
  }),

  // Newsletter signup
  subscribeNewsletter: asyncHandler(async (req, res) => {
    const { email, firstName } = req.body;

    // Here you would add to mailing list
    console.log('Newsletter subscription:', { email, firstName });

    ResponseHandler.success(res, null, 'Thank you for subscribing to our newsletter!');
  })
};

module.exports = publicController;
