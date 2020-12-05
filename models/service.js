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
    user: {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
      },
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
    user: Joi.objectId().required(),
    monthlyRate: Joi.number().max(5e4).required(),
  };
  return (valResult = Joi.validate(req.body, schema));
}

exports.Service = Service;
exports.validate = validateRequest;
