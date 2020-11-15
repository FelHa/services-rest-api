const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: {
        type:Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateRequest(req) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean(),
    }
    return valResult = Joi.validate(req.body, schema);
}

exports.User = User;
exports.validate = validateRequest;