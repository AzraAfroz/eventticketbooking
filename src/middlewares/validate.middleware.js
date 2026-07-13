const ApiError = require('../utils/ApiError');

/**
 * Middleware to validate request payload against a Joi schema
 * @param {object} schema - Joi validation schema
 * @param {string} [property='body'] - The property of req to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const errorDetails = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return next(ApiError.badRequest('Validation Error', errorDetails));
    }
    // Reassign validated and cast value back to req[property]
    req[property] = value;
    next();
  };
};

module.exports = validate;
