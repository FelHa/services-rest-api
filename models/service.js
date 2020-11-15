const Joi = require('joi');
const mongoose = require('mongoose');


const Service = mongoose.model('Service', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    }
}));

function validateRequest(req) {
    const schema = {
        title: Joi.string().required(),
        dailyRentalRate: Joi.number().max(255).required(),
    }
    return valResult = Joi.validate(req.body, schema);
}

exports.Service = Service;
exports.validate = validateRequest;