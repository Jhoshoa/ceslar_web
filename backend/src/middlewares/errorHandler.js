const logger = require('../helpers/logger');
const { AppError } = require('../commons/errors');
const config = require('../config');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError('Invalid ID format', 400, 'INVALID_ID');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409, 'DUPLICATE_KEY');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    error = new AppError('Validation failed', 422, 'VALIDATION_ERROR');
    error.errors = errors;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Auth0 errors
  if (err.name === 'UnauthorizedError') {
    error = new AppError(err.message || 'Unauthorized', 401, 'UNAUTHORIZED');
  }

  // Default response
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal server error',
    errorCode: error.errorCode || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  };

  // Include validation errors if present
  if (error.errors) {
    response.errors = error.errors;
  }

  // Include stack trace in development
  if (config.env === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errorCode: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
