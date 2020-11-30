const asyncTemplate = require('../middleware/asyncTemplate');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
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
    const subscription = await Subscription.find().sort('-dateOut');
    res.send(subscription);
  })
);

router.get(
  '/:id',
  [auth, validateObjectId],
  asyncTemplate(async (req, res) => {
    const subscription = await Subscription.findById({ _id: req.params.id });
    if (!subscription || subscription.length === 0)
      return res.status(404).send('No subscription with matching id found.');
    res.send(subscription);
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

    let subscription = await Subscription.lookup(
      req.body.user,
      req.body.service
    );
    if (subscription)
      return res
        .status(404)
        .send('This service has already been subscribed by the given user.');

    subscription = new Subscription({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      service: {
        _id: service._id,
        title: service.title,
        monthlyRate: service.monthlyRate,
      },
    });

    await subscription.save();

    res.send(subscription);
  })
);

module.exports = router;
