const asyncTemplate = require('../middleware/asyncTemplate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../shared/authorize');
const admin = require('../middleware/admin');
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
  [authenticate, admin],
  asyncTemplate(async (req, res) => {
    const subscriptions = await Subscription.find().sort('-dateOut');
    res.send(subscriptions);
  })
);

router.get(
  '/userSubscriptions',
  [authenticate],
  asyncTemplate(async (req, res) => {
    const subscriptions = await Subscription.find().sort('-dateOut');

    const filtered = subscriptions.filter(
      (subscription) => subscription.user._id == res.locals.token._id
    );

    res.send(filtered);
  })
);

router.get(
  '/:id',
  [authenticate, validateObjectId],
  asyncTemplate(async (req, res) => {
    const subscription = await Subscription.findById({ _id: req.params.id });

    if (!authorize(subscription.user._id, res))
      return res.status(403).send('User not authorized.');

    if (!subscription || subscription.length === 0)
      return res.status(404).send('No subscription with matching id found.');
    res.send(subscription);
  })
);

//post
router.post(
  '/',
  [authenticate, validateRequest(validate)],
  asyncTemplate(async (req, res) => {
    const user = await User.findById({ _id: req.body.user });

    if (!user) return res.status(404).send('No user with matching id found.');

    if (!authorize(user._id, res))
      return res.status(403).send('User not authorized.');

    const service = await Service.findById({ _id: req.body.service });
    if (!service)
      return res.status(404).send('No service with matching id found.');

    let subscription = await Subscription.lookup(
      req.body.user,
      req.body.service
    );
    if (subscription && !subscription.subscriptionFee)
      return res
        .status(404)
        .send('This service has already been subscribed by the given user.');

    subscription = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      service: {
        _id: service._id,
        title: service.title,
        costs: service.costs,
      },
    };

    if (!service.costs.isMonthly) {
      subscription.subscriptionFee = service.costs.amount;
    }

    subscription = new Subscription(subscription);

    await subscription.save();

    res.send(subscription);
  })
);

module.exports = router;
