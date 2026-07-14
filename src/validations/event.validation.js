const Joi = require('joi');

const createEvent = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  date: Joi.date().iso().optional(),
  eventDate: Joi.date().iso().optional(),
  venueId: Joi.number().integer().required(),
  organizerId: Joi.number().integer().optional(),
  categories: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().precision(2).positive().required(),
      capacity: Joi.number().integer().positive().required()
    })
  ).min(1).optional()
}).or('date', 'eventDate');

const updateEvent = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow('', null),
  date: Joi.date().iso().optional(),
  eventDate: Joi.date().iso().optional(),
  venueId: Joi.number().integer().optional(),
  organizerId: Joi.number().integer().optional()
});

module.exports = {
  createEvent,
  updateEvent
};
