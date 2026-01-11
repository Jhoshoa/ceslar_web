const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * General rate limiter
 */
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive endpoints (auth, etc.)
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts, please try again later',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    message: 'API rate limit exceeded',
    errorCode: 'API_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  strictLimiter,
  apiLimiter
};
