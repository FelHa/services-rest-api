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
    date: { type: Date, required: true, default: Date.now },
    categories: {
      type: [categorySchema],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 15,
      maxlength: 5000,
    },
    user: {
      _id: mongoose.Types.ObjectId,
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
    costs: {
      isMonthly: {
        type: Boolean,
        required: true,
      },
      amount: {
        type: Number,
        min: 0,
        max: 5e6,
        required: true,
      },
    },
  })
);

function validateRequest(req) {
  const schema = {
    title: Joi.string().required().min(1).max(255),
    categoryIds: Joi.array().items(Joi.objectId()).min(1),
    description: Joi.string().required().min(15).max(5000),
    user: Joi.objectId().required(),
    isMonthly: Joi.boolean().required(),
    amount: Joi.number().required(),
  };
  return (valResult = Joi.validate(req.body, schema));
}

exports.Service = Service;
exports.validate = validateRequest;
