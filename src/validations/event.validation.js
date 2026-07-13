const Joi = require('joi');

const createEvent = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  eventDate: Joi.date().iso().greater('now').required(),
  venueId: Joi.number().integer().required(),
  organizerId: Joi.number().integer().required(),
  categories: Joi.array().items(
    Joi.object({
      name: Joi.string().required(), // e.g. VIP, General
      price: Joi.number().precision(2).positive().required(),
      capacity: Joi.number().integer().positive().required()
    })
  ).min(1).required()
});

const updateEvent = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  eventDate: Joi.date().iso().greater('now').optional(),
  venueId: Joi.number().integer().optional(),
  organizerId: Joi.number().integer().optional()
});

module.exports = {
  createEvent,
  updateEvent
};
