const ApiError = require('../utils/ApiError');

/**
 * Middleware to handle unmatched routes (404 Not Found)
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Resource not found - ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
