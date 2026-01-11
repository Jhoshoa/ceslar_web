const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const config = require('./config');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');
const logger = require('./helpers/logger');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
app.use(generalLimiter);

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Church API Server',
    version: config.apiVersion,
    documentation: `/api/${config.apiVersion}/docs`
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}/api/${config.apiVersion}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
