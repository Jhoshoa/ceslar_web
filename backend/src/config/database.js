const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../helpers/logger');

const connectDB = async () => {
  try {
    const uri = config.env === 'test' ? config.mongodb.uriTest : config.mongodb.uri;

    await mongoose.connect(uri, config.mongodb.options);

    logger.info(`MongoDB connected successfully to ${config.env} database`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB disconnected');
};

module.exports = { connectDB, disconnectDB };
