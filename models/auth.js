const Joi = require('joi');

function validateRequest(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    }
    return valResult = Joi.validate(req.body, schema);
}

exports.validate = validateRequest;