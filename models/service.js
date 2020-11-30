const Joi = require('joi');
const mongoose = require('mongoose');
const { categorySchema } = require('./category');

const Service = mongoose.model(
  'Service',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    categories: {
      type: [categorySchema],
      required: true,
    },
    monthlyRate: {
      type: Number,
      required: true,
      min: 0,
      max: 5e4,
    },
  })
);

function validateRequest(req) {
  const schema = {
    title: Joi.string().required(),
    categoryIds: Joi.array().items(Joi.objectId()).min(1),
    monthlyRate: Joi.number().max(5e4).required(),
  };
  return (valResult = Joi.validate(req.body, schema));
}

exports.Service = Service;
exports.validate = validateRequest;
