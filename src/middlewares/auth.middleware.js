const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to req.user
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Access denied. No token provided.'));
  }

  try {
    const decoded = verifyToken(token);
    
    // decoded should contain user ID, email, role, and permissions
    req.user = decoded;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired authentication token.'));
  }
});

module.exports = authenticate;
