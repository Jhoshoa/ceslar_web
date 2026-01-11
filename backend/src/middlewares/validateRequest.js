const { validationResult } = require('express-validator');
const ResponseHandler = require('../helpers/responseHandler');

/**
 * Middleware to validate request using express-validator
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return ResponseHandler.validationError(res, formattedErrors);
  }

  next();
};

module.exports = validateRequest;
