/**
 * Migration: Add church references to existing data
 *
 * This migration:
 * 1. Finds or creates the headquarters church
 * 2. Updates all existing records to reference the headquarters church
 * 3. Migrates users to the new church membership structure
 *
 * Run with: node src/migrations/001-add-church-references.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../helpers/logger');
const {
  Church,
  User,
  Event,
  Sermon,
  Ministry,
  SmallGroup,
  PrayerRequest
} = require('../models');
const {
  CHURCH_STATUS,
  CHURCH_LEVELS,
  CHURCH_ROLES,
  MEMBERSHIP_STATUS,
  SYSTEM_ROLES,
  VISIBILITY_LEVELS,
  SERMON_VISIBILITY,
  MINISTRY_SCOPE
} = require('../commons/constants');

const migrateToMultiChurch = async () => {
  try {
    logger.info('Starting migration: Add church references to existing data');

    // Connect to database
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    logger.info('Connected to database');

    // Step 1: Find or create headquarters church
    let hqChurch = await Church.findOne({ isHeadquarters: true });

    if (!hqChurch) {
      logger.info('No headquarters church found. Creating one...');
      hqChurch = await Church.create({
        name: 'Sede Central Internacional',
        slug: 'sede-central-santa-cruz-bolivia',
        level: CHURCH_LEVELS.HEADQUARTERS,
        isHeadquarters: true,
        region: 'South America',
        country: 'Bolivia',
        department: 'Santa Cruz',
        city: 'Santa Cruz de la Sierra',
        address: 'Calle Chesterton esquina Walt Whitman, Barrio Los Tusequis',
        phone: '(591) 3-3424802',
        status: CHURCH_STATUS.ACTIVE,
        settings: {
          defaultLanguage: 'es',
          timezone: 'America/La_Paz',
          allowMemberRegistration: true,
          requireApproval: true
        }
      });
      logger.info(`Created headquarters church: ${hqChurch.name}`);
    } else {
      logger.info(`Found headquarters church: ${hqChurch.name}`);
    }

    const hqChurchId = hqChurch._id;

    // Step 2: Update Events
    const eventsToUpdate = await Event.countDocuments({ church: { $exists: false } });
    if (eventsToUpdate > 0) {
      const eventResult = await Event.updateMany(
        { church: { $exists: false } },
        {
          $set: {
            church: hqChurchId,
            visibility: VISIBILITY_LEVELS.GLOBAL // Make existing events globally visible
          }
        }
      );
      logger.info(`Updated ${eventResult.modifiedCount} events with church reference`);
    } else {
      logger.info('No events need updating');
    }

    // Step 3: Update Sermons
    const sermonsToUpdate = await Sermon.countDocuments({ church: { $exists: false } });
    if (sermonsToUpdate > 0) {
      const sermonResult = await Sermon.updateMany(
        { church: { $exists: false } },
        {
          $set: {
            church: hqChurchId,
            sermonVisibility: SERMON_VISIBILITY.NETWORK_WIDE
          }
        }
      );
      logger.info(`Updated ${sermonResult.modifiedCount} sermons with church reference`);
    } else {
      logger.info('No sermons need updating');
    }

    // Step 4: Update Ministries
    const ministriesToUpdate = await Ministry.countDocuments({ church: { $exists: false } });
    if (ministriesToUpdate > 0) {
      const ministryResult = await Ministry.updateMany(
        { church: { $exists: false } },
        {
          $set: {
            church: hqChurchId,
            scope: MINISTRY_SCOPE.GLOBAL // Make existing ministries globally visible
          }
        }
      );
      logger.info(`Updated ${ministryResult.modifiedCount} ministries with church reference`);
    } else {
      logger.info('No ministries need updating');
    }

    // Step 5: Update SmallGroups
    const smallGroupsToUpdate = await SmallGroup.countDocuments({ church: { $exists: false } });
    if (smallGroupsToUpdate > 0) {
      const smallGroupResult = await SmallGroup.updateMany(
        { church: { $exists: false } },
        {
          $set: {
            church: hqChurchId
          }
        }
      );
      logger.info(`Updated ${smallGroupResult.modifiedCount} small groups with church reference`);
    } else {
      logger.info('No small groups need updating');
    }

    // Step 6: Update PrayerRequests
    const prayerRequestsToUpdate = await PrayerRequest.countDocuments({ church: { $exists: false } });
    if (prayerRequestsToUpdate > 0) {
      const prayerResult = await PrayerRequest.updateMany(
        { church: { $exists: false } },
        {
          $set: {
            church: hqChurchId
          }
        }
      );
      logger.info(`Updated ${prayerResult.modifiedCount} prayer requests with church reference`);
    } else {
      logger.info('No prayer requests need updating');
    }

    // Step 7: Migrate Users
    const usersToMigrate = await User.countDocuments({
      churchMemberships: { $exists: false }
    });

    if (usersToMigrate > 0) {
      logger.info(`Migrating ${usersToMigrate} users to new church membership structure...`);

      // Get all users that need migration
      const users = await User.find({
        $or: [
          { churchMemberships: { $exists: false } },
          { churchMemberships: { $size: 0 } }
        ]
      });

      for (const user of users) {
        // Map old role to new church role
        let churchRole = CHURCH_ROLES.VISITOR;
        let systemRole = SYSTEM_ROLES.USER;

        switch (user.role) {
          case 'admin':
            churchRole = CHURCH_ROLES.ADMIN;
            systemRole = SYSTEM_ROLES.SYSTEM_ADMIN;
            break;
          case 'pastor':
            churchRole = CHURCH_ROLES.PASTOR;
            break;
          case 'staff':
          case 'leader':
            churchRole = CHURCH_ROLES.LEADER;
            break;
          case 'member':
            churchRole = CHURCH_ROLES.MEMBER;
            break;
          default:
            churchRole = CHURCH_ROLES.VISITOR;
        }

        // Update user
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              systemRole: systemRole,
              primaryChurch: hqChurchId,
              churchMemberships: [{
                church: hqChurchId,
                role: churchRole,
                status: MEMBERSHIP_STATUS.APPROVED,
                joinedAt: user.memberSince || user.createdAt || new Date()
              }],
              preferredLanguage: 'es'
            }
          }
        );
      }

      logger.info(`Migrated ${users.length} users to new church membership structure`);
    } else {
      logger.info('No users need migration');
    }

    // Step 8: Update church statistics
    const memberCount = await User.countDocuments({
      'churchMemberships.church': hqChurchId,
      'churchMemberships.status': MEMBERSHIP_STATUS.APPROVED
    });

    const eventCount = await Event.countDocuments({ church: hqChurchId });
    const sermonCount = await Sermon.countDocuments({ church: hqChurchId });

    await Church.updateOne(
      { _id: hqChurchId },
      {
        $set: {
          'stats.memberCount': memberCount,
          'stats.eventCount': eventCount,
          'stats.sermonCount': sermonCount
        }
      }
    );

    logger.info(`Updated headquarters church statistics: ${memberCount} members, ${eventCount} events, ${sermonCount} sermons`);

    logger.info('Migration completed successfully!');

  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
};

// Rollback function (if needed)
const rollback = async () => {
  try {
    logger.info('Starting rollback: Remove church references');

    await mongoose.connect(config.mongodb.uri, config.mongodb.options);

    // Remove church field from all documents
    await Event.updateMany({}, { $unset: { church: '', sharedWithChurches: '', visibility: '' } });
    await Sermon.updateMany({}, { $unset: { church: '', sermonVisibility: '' } });
    await Ministry.updateMany({}, { $unset: { church: '', scope: '' } });
    await SmallGroup.updateMany({}, { $unset: { church: '' } });
    await PrayerRequest.updateMany({}, { $unset: { church: '', sharedWithChurches: '' } });

    // Remove church membership fields from users
    await User.updateMany({}, {
      $unset: {
        systemRole: '',
        primaryChurch: '',
        churchMemberships: '',
        registrationAnswers: '',
        registrationCompleted: '',
        registrationCompletedAt: '',
        preferredLanguage: '',
        location: ''
      }
    });

    logger.info('Rollback completed');

  } catch (error) {
    logger.error('Rollback failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--rollback')) {
    rollback()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    migrateToMultiChurch()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { migrateToMultiChurch, rollback };
