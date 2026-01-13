const { errorHandler, notFoundHandler } = require('./errorHandler');
const validateRequest = require('./validateRequest');
const { generalLimiter, strictLimiter, apiLimiter } = require('./rateLimiter');
const churchPermissions = require('./churchPermissions');

module.exports = {
  errorHandler,
  notFoundHandler,
  validateRequest,
  generalLimiter,
  strictLimiter,
  apiLimiter,
  ...churchPermissions
};
