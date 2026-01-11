const Sermon = require('../models/Sermon');
const logger = require('../helpers/logger');
const { SERMON_CATEGORIES } = require('../commons/constants');

const sermons = [
  {
    title: 'The Power of Faith',
    description: 'Exploring how faith can move mountains and transform our daily lives. A powerful message about trusting God in all circumstances.',
    speakerName: 'Pastor John Smith',
    category: SERMON_CATEGORIES.SUNDAY_SERVICE,
    series: {
      name: 'Faith Foundations',
      part: 1,
      totalParts: 4
    },
    scripture: {
      book: 'Hebrews',
      chapter: '11',
      verses: '1-6',
      fullReference: 'Hebrews 11:1-6'
    },
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 45,
    media: {
      videoUrl: 'https://example.com/sermons/power-of-faith',
      thumbnailUrl: 'https://example.com/thumbnails/power-of-faith.jpg'
    },
    tags: ['faith', 'trust', 'hebrews', 'foundations'],
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Walking in Love',
    description: 'Understanding God\'s unconditional love and how we can reflect that love to others in our community.',
    speakerName: 'Pastor John Smith',
    category: SERMON_CATEGORIES.SUNDAY_SERVICE,
    series: {
      name: 'Faith Foundations',
      part: 2,
      totalParts: 4
    },
    scripture: {
      book: '1 Corinthians',
      chapter: '13',
      verses: '1-13',
      fullReference: '1 Corinthians 13:1-13'
    },
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    duration: 42,
    media: {
      videoUrl: 'https://example.com/sermons/walking-in-love',
      thumbnailUrl: 'https://example.com/thumbnails/walking-in-love.jpg'
    },
    tags: ['love', 'community', 'corinthians', 'foundations'],
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Finding Hope in Difficult Times',
    description: 'A message of encouragement for those going through trials. Learn how to hold onto hope when life gets hard.',
    speakerName: 'Pastor John Smith',
    category: SERMON_CATEGORIES.SUNDAY_SERVICE,
    scripture: {
      book: 'Romans',
      chapter: '8',
      verses: '28-39',
      fullReference: 'Romans 8:28-39'
    },
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    duration: 48,
    media: {
      videoUrl: 'https://example.com/sermons/finding-hope',
      thumbnailUrl: 'https://example.com/thumbnails/finding-hope.jpg'
    },
    tags: ['hope', 'trials', 'romans', 'encouragement'],
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'The Heart of Worship',
    description: 'Discovering what true worship looks like and how to cultivate a lifestyle of worship beyond Sunday morning.',
    speakerName: 'Pastor Sarah Johnson',
    category: SERMON_CATEGORIES.WEDNESDAY_BIBLE_STUDY,
    scripture: {
      book: 'John',
      chapter: '4',
      verses: '21-24',
      fullReference: 'John 4:21-24'
    },
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: 38,
    media: {
      videoUrl: 'https://example.com/sermons/heart-of-worship',
      thumbnailUrl: 'https://example.com/thumbnails/heart-of-worship.jpg'
    },
    tags: ['worship', 'john', 'lifestyle', 'praise'],
    isPublished: true,
    isFeatured: false,
    membersOnly: true,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

const seed = async () => {
  try {
    const existingCount = await Sermon.countDocuments();
    if (existingCount > 0) {
      logger.info(`Sermons already seeded (${existingCount} sermons found). Skipping...`);
      return;
    }

    await Sermon.insertMany(sermons);
    logger.info(`Successfully seeded ${sermons.length} sermons`);
  } catch (error) {
    logger.error('Sermon seeding failed:', error);
    throw error;
  }
};

const clear = async () => {
  await Sermon.deleteMany({});
  logger.info('Sermons collection cleared');
};

module.exports = { seed, clear };
