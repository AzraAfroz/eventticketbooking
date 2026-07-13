const Joi = require('joi');

const createBooking = Joi.object({
  eventId: Joi.number().integer().required(),
  seats: Joi.array().items(
    Joi.object({
      seatCategoryId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).max(10).required()
    })
  ).min(1).required()
});

const updateBookingStatus = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'expired').required()
});

module.exports = {
  createBooking,
  updateBookingStatus
};
