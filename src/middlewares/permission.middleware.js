const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/constants');

/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies if the authenticated user has the required permission
 * @param {string} requiredPermission - The permission string to check
 */
const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    // Super Admin bypasses all permission checks
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    const permissions = req.user.permissions || [];
    const hasPermission = permissions.includes(requiredPermission);

    if (!hasPermission) {
      return next(ApiError.forbidden('Forbidden. You do not have permission to perform this action.'));
    }

    next();
  };
};

module.exports = authorize;
