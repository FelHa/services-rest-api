const asyncTemplate = require('../middleware/asyncTemplate');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Subscription, validate } = require('../models/subscription');
const { User } = require('../models/user');
const { Service } = require('../models/service');
const validateObjectId = require('../middleware/validateObjectId');
const validateRequest = require('../middleware/validateRequest');

//get
router.get(
  '/',
  auth,
  asyncTemplate(async (req, res) => {
    const rentals = await Subscription.find().sort('-dateOut');
    res.send(rentals);
  })
);

router.get(
  '/:id',
  [auth, validateObjectId],
  asyncTemplate(async (req, res) => {
    const rental = await Subscription.findById({ _id: req.params.id });
    if (!rental || rental.length === 0)
      return res.status(404).send('No rental with matching id found.');
    res.send(rental);
  })
);

//post
router.post(
  '/',
  [auth, validateRequest(validate)],
  asyncTemplate(async (req, res) => {
    const user = await User.findById({ _id: req.body.user });

    if (!user) return res.status(404).send('No user with matching id found.');

    const service = await Service.findById({ _id: req.body.service });
    if (!service)
      return res.status(404).send('No service with matching id found.');

    let rental = await Subscription.lookup(req.body.user, req.body.service);
    if (rental)
      return res
        .status(404)
        .send('This service has already been booked by the given user.');

    rental = new Subscription({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      service: {
        _id: service._id,
        title: service.title,
        dailyRentalRate: service.dailyRentalRate,
      },
    });

    await rental.save();

    res.send(rental);
  })
);

module.exports = router;
