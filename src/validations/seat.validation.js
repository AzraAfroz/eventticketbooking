const Joi = require('joi');

const bulkGenerate = Joi.object({
  seatCategoryId: Joi.number().integer().required(),
  rows: Joi.alternatives().try(
    Joi.number().integer().min(1).max(100),
    Joi.array().items(Joi.string().max(10)).min(1)
  ).required(),
  columns: Joi.number().integer().min(1).max(100).required()
});

module.exports = {
  bulkGenerate
};
