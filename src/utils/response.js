/**
 * Standard API success response structure
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - User-friendly message
 * @param {object|array} data - The payload
 * @param {object} [meta] - Optional pagination or metadata
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const responseBody = {
    success: true,
    message,
  };

  if (data !== null) {
    responseBody.data = data;
  }

  if (meta !== null) {
    responseBody.meta = meta;
  }

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  successResponse
};
