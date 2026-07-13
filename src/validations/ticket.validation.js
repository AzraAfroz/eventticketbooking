const Joi = require('joi');

const validateTicket = Joi.object({
  ticketNumber: Joi.string().required()
});

module.exports = {
  validateTicket
};
