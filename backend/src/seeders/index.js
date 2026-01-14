require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../helpers/logger');

const churchSeeder = require('./churchSeeder');
const userSeeder = require('./userSeeder');
const eventSeeder = require('./eventSeeder');
const sermonSeeder = require('./sermonSeeder');
const ministrySeeder = require('./ministrySeeder');
const questionSeeder = require('./questionSeeder');

// Helper to clear all data (used by force mode and clearAll)
const clearAllData = async () => {
  // Clear in reverse order of dependencies
  await questionSeeder.clear();
  await eventSeeder.clear();
  await sermonSeeder.clear();
  await userSeeder.clear();
  await ministrySeeder.clear();
  await churchSeeder.clear();
  logger.info('All data cleared');
};

const runSeeders = async (options = {}) => {
  const { force = false } = options;

  try {
    logger.info('Connecting to database...');
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    logger.info('Connected to database');

    if (force) {
      logger.info('Force mode enabled - clearing existing data first...');
      await clearAllData();
    }

    logger.info('Running seeders...');

    // Run seeders in order (some may depend on others)
    // 1. Churches first (required for all other entities)
    await churchSeeder.seed();

    // 2. Ministries (may be referenced by users)
    await ministrySeeder.seed();

    // 3. Users (need churches to exist)
    await userSeeder.seed();

    // 4. Sermons (need churches and users)
    await sermonSeeder.seed();

    // 5. Events (need churches, users, and possibly ministries)
    await eventSeeder.seed();

    // 6. Questions for registration form
    await questionSeeder.seed();

    logger.info('All seeders completed successfully');

  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  }
};

// Clear all seeded data (useful for development)
const clearAll = async () => {
  try {
    logger.info('Connecting to database...');
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    logger.info('Connected to database');

    logger.info('Clearing all seeded data...');
    await clearAllData();
    logger.info('All data cleared successfully');

  } catch (error) {
    logger.error('Clear failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--clear')) {
    clearAll();
  } else if (args.includes('--force') || args.includes('-f')) {
    // Force mode: clear all data and reseed
    logger.info('Running with --force flag: will clear existing data and reseed');
    runSeeders({ force: true });
  } else {
    runSeeders();
  }
}

module.exports = { runSeeders, clearAll };
