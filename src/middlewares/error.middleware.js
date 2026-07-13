const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError instances (like Sequelize errors or generic errors) to ApiError
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errors = [];

    // Specific mapping for Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400;
      message = 'Database Validation Error';
      errors = error.errors.map(e => ({
        field: e.path,
        message: e.message
      }));
    } else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token. Please log in again.';
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token has expired. Please log in again.';
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  // Log the error
  logger.error(`[API Error] ${req.method} ${req.originalUrl} - Status: ${error.statusCode} - Message: ${error.message}`);
  if (error.statusCode === 500 || process.env.NODE_ENV === 'development') {
    logger.error(error.stack || '');
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
