const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to req.user
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized('Access denied. No token provided.'));
  }

  const token = authHeader.split(" ")[1];

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
