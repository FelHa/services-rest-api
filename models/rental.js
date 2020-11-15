const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            email: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true,
            }
        }),
        required: true
    },
    service: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 255
            },
            dailyRentalRate: { 
              type: Number, 
              required: true,
              min: 0,
              max: 255
            }   
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
        required: false
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

rentalSchema.statics.lookup = function(userId, serviceId){
    return this.findOne(
        {'user._id': userId,
         'service._id': serviceId,
         'dateReturned': {$exists: false},
        });
};

rentalSchema.methods.return = function(){
    this.dateReturned = new Date();
    this.rentalFee = moment().diff(this.dateOut, 'days') * this.service.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validateRequest(req) {
    const schema = {
        user: Joi.objectId().required(),
        service: Joi.objectId().required()
    }
    return valResult = Joi.validate(req.body, schema);
}

exports.Rental = Rental;
exports.validate = validateRequest;