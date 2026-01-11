const Event = require('../models/Event');
const logger = require('../helpers/logger');
const { EVENT_TYPES, EVENT_STATUS } = require('../commons/constants');

const getNextSunday = (weeksAhead = 0) => {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  date.setDate(date.getDate() + diff + (weeksAhead * 7));
  date.setHours(10, 0, 0, 0);
  return date;
};

const events = [
  {
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly Sunday worship service. Experience powerful worship, relevant teaching, and genuine community.',
    shortDescription: 'Weekly Sunday worship at 10:00 AM',
    type: EVENT_TYPES.SERVICE,
    status: EVENT_STATUS.PUBLISHED,
    startDate: getNextSunday(),
    endDate: new Date(getNextSunday().getTime() + 90 * 60000), // 90 minutes
    location: {
      name: 'Main Sanctuary',
      address: '123 Church Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    isRecurring: true,
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [0]
    },
    isFeatured: true,
    isPublic: true
  },
  {
    title: 'Wednesday Bible Study',
    description: 'Dive deeper into God\'s Word with our mid-week Bible study. Currently studying the book of Romans.',
    shortDescription: 'Mid-week Bible study at 7:00 PM',
    type: EVENT_TYPES.BIBLE_STUDY,
    status: EVENT_STATUS.PUBLISHED,
    startDate: (() => {
      const date = new Date();
      const day = date.getDay();
      const diff = day <= 3 ? 3 - day : 10 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(19, 0, 0, 0);
      return date;
    })(),
    endDate: (() => {
      const date = new Date();
      const day = date.getDay();
      const diff = day <= 3 ? 3 - day : 10 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(20, 30, 0, 0);
      return date;
    })(),
    location: {
      name: 'Fellowship Hall',
      address: '123 Church Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    isRecurring: true,
    isFeatured: false,
    isPublic: true
  },
  {
    title: 'Youth Group Night',
    description: 'A fun and faith-filled evening for middle and high school students. Games, worship, and relevant teaching.',
    shortDescription: 'Youth gathering every Friday at 6:30 PM',
    type: EVENT_TYPES.YOUTH_EVENT,
    status: EVENT_STATUS.PUBLISHED,
    startDate: (() => {
      const date = new Date();
      const day = date.getDay();
      const diff = day <= 5 ? 5 - day : 12 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(18, 30, 0, 0);
      return date;
    })(),
    endDate: (() => {
      const date = new Date();
      const day = date.getDay();
      const diff = day <= 5 ? 5 - day : 12 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(20, 30, 0, 0);
      return date;
    })(),
    location: {
      name: 'Youth Center',
      address: '123 Church Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    registration: {
      required: false
    },
    isFeatured: true,
    isPublic: true
  },
  {
    title: 'Community Outreach Day',
    description: 'Join us as we serve our community through various outreach projects. Lunch provided for all volunteers.',
    shortDescription: 'Serving our community together',
    type: EVENT_TYPES.OUTREACH,
    status: EVENT_STATUS.PUBLISHED,
    startDate: (() => {
      const date = getNextSunday(2);
      date.setHours(9, 0, 0, 0);
      return date;
    })(),
    endDate: (() => {
      const date = getNextSunday(2);
      date.setHours(14, 0, 0, 0);
      return date;
    })(),
    location: {
      name: 'Church Parking Lot',
      address: '123 Church Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    registration: {
      required: true,
      maxAttendees: 100,
      deadline: getNextSunday(1)
    },
    isFeatured: true,
    isPublic: true
  }
];

const seed = async () => {
  try {
    const existingCount = await Event.countDocuments();
    if (existingCount > 0) {
      logger.info(`Events already seeded (${existingCount} events found). Skipping...`);
      return;
    }

    await Event.insertMany(events);
    logger.info(`Successfully seeded ${events.length} events`);
  } catch (error) {
    logger.error('Event seeding failed:', error);
    throw error;
  }
};

const clear = async () => {
  await Event.deleteMany({});
  logger.info('Events collection cleared');
};

module.exports = { seed, clear };
