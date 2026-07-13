const Joi = require('joi');

const createVenue = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().optional(),
  country: Joi.string().required(),
  zipCode: Joi.string().required(),
  capacity: Joi.number().integer().min(1).required()
});

const updateVenue = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  capacity: Joi.number().integer().min(1).optional()
});

module.exports = {
  createVenue,
  updateVenue
};
