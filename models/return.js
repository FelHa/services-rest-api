const Joi = require('joi');

function validateRequest(req) {
    const schema = {
        userId: Joi.objectId().required(),
        serviceId: Joi.objectId().required()
    }
    return valResult = Joi.validate(req.body, schema);
}

exports.validate = validateRequest;