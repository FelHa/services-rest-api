const asyncTemplate = require('../middleware/asyncTemplate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const {Service, validate} = require('../models/service');
const validateRequest = require('../middleware/validateRequest');
const validateObjectId = require('../middleware/validateObjectId');

//get
router.get('/', asyncTemplate(async (req, res) => {
    const services = await Service.find().sort('name');
    res.send(services);
}));

router.get('/:id', validateObjectId, asyncTemplate(async (req, res) => {
    const service = await Service.findById({ _id: req.params.id });
    if (!service) return res.status(404).send('No service with matching id found.');
    res.send(service);
}));

//post
router.post('/', [auth, validateRequest(validate)],  asyncTemplate(async (req, res) => {
    let service = new Service({
        title: req.body.title,
        dailyRentalRate: req.body.dailyRentalRate 
    });
    service = await service.save();
    res.send(service);
}));

//put
router.put('/:id', [auth, validateRequest(validate), validateObjectId], asyncTemplate(async (req, res) => {
    const update = {
        title: req.body.title,
        dailyRentalRate: req.body.dailyRentalRate 
    };
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).send('No service with matching id found.')
    await service.set(update).save();
    res.send(service);
}));

//delete
router.delete('/:id', [auth, admin, validateObjectId], asyncTemplate(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).send('No service with matching id found.')
    service.remove();
    res.send(service);
}));

module.exports = router;