const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Service} = require('../models/service');
const auth = require('../middleware/auth');
const {validate} = require('../models/return');
const validateRequest = require('../middleware/validateRequest');
const Fawn = require('fawn');

router.post('/', [auth, validateRequest(validate)], async (req, res)=>{

    const rental = await Rental.lookup(req.body.userId, req.body.serviceId);
    if(!rental) return res.status(404).send('No rental found with ids provided.');

    if(rental.dateReturned) return res.status(400).send('Rantal already processed.');
    
    rental.return();

    await rental.save();
    
    await Service.update({_id: rental.service._id}, { $inc: { numberInStock: 1}});
    
    return res.status(200).send(rental);

});

module.exports = router;