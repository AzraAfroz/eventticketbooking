const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to req.user
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    const match = req.headers.authorization.match(/^bearer\s+(.+)$/i);
    if (match) {
      token = match[1];
    }
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
