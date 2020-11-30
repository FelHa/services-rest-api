const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
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
    }),
    required: true,
  },
  service: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
      },
      monthlyRate: {
        type: Number,
        required: true,
        min: 0,
        max: 5e4,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
    required: false,
  },
  subscriptionFee: {
    type: Number,
    min: 0,
  },
});

subscriptionSchema.statics.lookup = function (userId, serviceId) {
  return this.findOne({
    'user._id': userId,
    'service._id': serviceId,
    dateReturned: { $exists: false },
  });
};

subscriptionSchema.methods.return = function () {
  this.dateReturned = new Date();
  this.subscriptionFee =
    (moment().diff(this.dateOut, 'months') + 1) * this.service.monthlyRate;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

function validateRequest(req) {
  const schema = {
    user: Joi.objectId().required(),
    service: Joi.objectId().required(),
  };
  return (valResult = Joi.validate(req.body, schema));
}

exports.Subscription = Subscription;
exports.validate = validateRequest;
