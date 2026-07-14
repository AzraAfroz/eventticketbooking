const ApiError = require('../utils/ApiError');


const notFound = (req, res, next) => {
  next(ApiError.notFound(`Resource not found - ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
