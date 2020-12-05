const express = require('express');
const router = express.Router();
const { Subscription } = require('../models/subscription');
const authenticate = require('../middleware/authenticate');
const authorize = require('../shared/authorize');
const { validate } = require('../models/cancelation');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/',
  [authenticate, validateRequest(validate)],
  async (req, res) => {
    const subscription = await Subscription.lookup(
      req.body.userId,
      req.body.serviceId
    );
    if (!subscription)
      return res.status(404).send('No subscription found with ids provided.');

    if (!authorize(subscription.user._id, res))
      return res.status(403).send('User not authorized.');

    if (!subscription.service.costs.isMonthly)
      return res.status(404).send('One-time costs cannot be canceld.');

    if (subscription.dateReturned)
      return res.status(400).send('Subscription already canceld.');

    subscription.return();

    await subscription.save();

    return res.status(200).send(subscription);
  }
);

module.exports = router;
