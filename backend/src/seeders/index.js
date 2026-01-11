require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../helpers/logger');

const userSeeder = require('./userSeeder');
const eventSeeder = require('./eventSeeder');
const sermonSeeder = require('./sermonSeeder');
const ministrySeeder = require('./ministrySeeder');

const runSeeders = async () => {
  try {
    logger.info('Connecting to database...');
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    logger.info('Connected to database');

    logger.info('Running seeders...');

    // Run seeders in order (some may depend on others)
    await ministrySeeder.seed();
    await userSeeder.seed();
    await sermonSeeder.seed();
    await eventSeeder.seed();

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

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders };
