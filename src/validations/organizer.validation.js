const Joi = require('joi');

const createOrganizer = Joi.object({
  userId: Joi.number().integer().required(),
  companyName: Joi.string().required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  address: Joi.string().optional()
});

const updateOrganizer = Joi.object({
  companyName: Joi.string().optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  address: Joi.string().optional()
});

module.exports = {
  createOrganizer,
  updateOrganizer
};
