const Ministry = require('../models/Ministry');
const logger = require('../helpers/logger');
const { MINISTRY_TYPES } = require('../commons/constants');

const ministries = [
  {
    name: "Children's Ministry",
    type: MINISTRY_TYPES.CHILDREN,
    description: 'Our Children\'s Ministry provides a safe, fun, and faith-filled environment for kids from nursery through 5th grade. We use age-appropriate teaching methods to help children learn about God\'s love.',
    shortDescription: 'Fun and faith-filled programs for kids nursery through 5th grade.',
    meetingSchedule: {
      day: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
      location: 'Children\'s Wing'
    },
    ageRange: {
      min: 0,
      max: 11,
      description: 'Nursery through 5th Grade'
    },
    isActive: true,
    isFeatured: true,
    displayOrder: 1
  },
  {
    name: 'Youth Ministry',
    type: MINISTRY_TYPES.YOUTH,
    description: 'Our Youth Ministry is designed to help middle and high school students grow in their faith while building lasting friendships. Weekly gatherings include worship, games, and relevant Biblical teaching.',
    shortDescription: 'Helping teens grow in faith and build lasting friendships.',
    meetingSchedule: {
      day: 'Friday',
      time: '6:30 PM',
      frequency: 'Weekly',
      location: 'Youth Center'
    },
    ageRange: {
      min: 12,
      max: 18,
      description: '6th through 12th Grade'
    },
    isActive: true,
    isFeatured: true,
    displayOrder: 2
  },
  {
    name: 'Young Adults',
    type: MINISTRY_TYPES.YOUNG_ADULTS,
    description: 'A community for college students and young professionals to connect, grow spiritually, and navigate life\'s transitions together. We meet for Bible study, fellowship, and service projects.',
    shortDescription: 'Community for college students and young professionals.',
    meetingSchedule: {
      day: 'Thursday',
      time: '7:00 PM',
      frequency: 'Weekly',
      location: 'Fellowship Hall'
    },
    ageRange: {
      min: 18,
      max: 30,
      description: 'Ages 18-30'
    },
    isActive: true,
    isFeatured: false,
    displayOrder: 3
  },
  {
    name: "Men's Ministry",
    type: MINISTRY_TYPES.MEN,
    description: 'Men\'s Ministry exists to help men become the spiritual leaders God has called them to be. We offer Bible studies, mentorship opportunities, and fellowship events throughout the year.',
    shortDescription: 'Equipping men to be spiritual leaders.',
    meetingSchedule: {
      day: 'Saturday',
      time: '8:00 AM',
      frequency: 'Bi-weekly',
      location: 'Fellowship Hall'
    },
    isActive: true,
    isFeatured: false,
    displayOrder: 4
  },
  {
    name: "Women's Ministry",
    type: MINISTRY_TYPES.WOMEN,
    description: 'Women\'s Ministry provides opportunities for women to grow in faith, build meaningful relationships, and discover their God-given purpose. We offer Bible studies, retreats, and special events.',
    shortDescription: 'Empowering women to grow in faith and community.',
    meetingSchedule: {
      day: 'Tuesday',
      time: '10:00 AM',
      frequency: 'Weekly',
      location: 'Chapel'
    },
    isActive: true,
    isFeatured: false,
    displayOrder: 5
  },
  {
    name: 'Worship & Arts',
    type: MINISTRY_TYPES.WORSHIP,
    description: 'Our Worship & Arts Ministry leads the congregation in authentic worship through music, drama, and creative expression. We welcome musicians, vocalists, and tech volunteers.',
    shortDescription: 'Leading worship through music and creative arts.',
    meetingSchedule: {
      day: 'Wednesday',
      time: '7:00 PM',
      frequency: 'Weekly',
      location: 'Sanctuary'
    },
    isActive: true,
    isFeatured: true,
    displayOrder: 6
  },
  {
    name: 'Missions & Outreach',
    type: MINISTRY_TYPES.MISSIONS,
    description: 'We are committed to sharing the love of Christ locally and globally. Our missions program supports missionaries worldwide and organizes local outreach events to serve our community.',
    shortDescription: 'Serving locally and globally to share Christ\'s love.',
    isActive: true,
    isFeatured: true,
    displayOrder: 7
  },
  {
    name: 'Care & Support',
    type: MINISTRY_TYPES.CARE_SUPPORT,
    description: 'Our Care Ministry provides compassionate support for those going through difficult times. We offer grief support, hospital visitation, meal trains, and prayer ministry.',
    shortDescription: 'Compassionate support for those in need.',
    isActive: true,
    isFeatured: false,
    displayOrder: 8
  }
];

const seed = async () => {
  try {
    const existingCount = await Ministry.countDocuments();
    if (existingCount > 0) {
      logger.info(`Ministries already seeded (${existingCount} ministries found). Skipping...`);
      return;
    }

    await Ministry.insertMany(ministries);
    logger.info(`Successfully seeded ${ministries.length} ministries`);
  } catch (error) {
    logger.error('Ministry seeding failed:', error);
    throw error;
  }
};

const clear = async () => {
  await Ministry.deleteMany({});
  logger.info('Ministries collection cleared');
};

module.exports = { seed, clear };
