const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * Middleware to run express-validator validations and return 400
 * with field-level errors if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw ApiError.badRequest('Validation failed', extractedErrors);
  }

  next();
};

module.exports = validate;
