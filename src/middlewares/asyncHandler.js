/**
 * Wraps asynchronous Express route handlers to catch unresolved promises and forward them to the error handler.
 * @param {Function} fn - The async request handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
