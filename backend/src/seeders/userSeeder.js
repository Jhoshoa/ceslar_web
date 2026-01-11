const User = require('../models/User');
const logger = require('../helpers/logger');
const { ROLES } = require('../commons/constants');

const users = [
  {
    auth0Id: 'auth0|seed_admin_001',
    email: 'admin@church.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1 (555) 000-0001',
    role: ROLES.ADMIN,
    isMember: true,
    memberSince: new Date('2020-01-01'),
    address: {
      street: '123 Church Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    }
  },
  {
    auth0Id: 'auth0|seed_pastor_001',
    email: 'pastor@church.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 (555) 000-0002',
    role: ROLES.PASTOR,
    isMember: true,
    memberSince: new Date('2015-06-01'),
    address: {
      street: '456 Faith Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    }
  },
  {
    auth0Id: 'auth0|seed_staff_001',
    email: 'staff@church.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1 (555) 000-0003',
    role: ROLES.STAFF,
    isMember: true,
    memberSince: new Date('2018-03-15')
  },
  {
    auth0Id: 'auth0|seed_member_001',
    email: 'member@church.com',
    firstName: 'Michael',
    lastName: 'Williams',
    phone: '+1 (555) 000-0004',
    role: ROLES.MEMBER,
    isMember: true,
    memberSince: new Date('2021-09-01')
  },
  {
    auth0Id: 'auth0|seed_member_002',
    email: 'jane.doe@email.com',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+1 (555) 000-0005',
    role: ROLES.MEMBER,
    isMember: true,
    memberSince: new Date('2022-01-15')
  }
];

const seed = async () => {
  try {
    // Check if users already exist
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      logger.info(`Users already seeded (${existingCount} users found). Skipping...`);
      return;
    }

    await User.insertMany(users);
    logger.info(`Successfully seeded ${users.length} users`);
  } catch (error) {
    logger.error('User seeding failed:', error);
    throw error;
  }
};

const clear = async () => {
  await User.deleteMany({});
  logger.info('Users collection cleared');
};

module.exports = { seed, clear, users };
