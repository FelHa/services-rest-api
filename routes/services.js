const asyncTemplate = require('../middleware/asyncTemplate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../shared/authorize');
const express = require('express');
const router = express.Router();
const { Service, validate } = require('../models/service');
const { User } = require('../models/user');
const validateRequest = require('../middleware/validateRequest');
const validateObjectId = require('../middleware/validateObjectId');
const { Category } = require('../models/category');

//get
router.get(
  '/',
  [authenticate],
  asyncTemplate(async (req, res) => {
    const services = await Service.find().sort('name');
    res.send(services);
  })
);

router.get(
  '/:id',
  [authenticate, validateObjectId],
  asyncTemplate(async (req, res) => {
    const service = await Service.findById({ _id: req.params.id });
    if (!service)
      return res.status(404).send('No service with matching id found.');

    res.send(service);
  })
);

//post
router.post(
  '/',
  [authenticate, validateRequest(validate)],
  asyncTemplate(async (req, res) => {
    const categories = await Category.getCategories(req.body.categoryIds);
    if (categories.length === 0 || categories[0] === null)
      return res.status(400).send('Invalid category.');

    const user = await User.findById({ _id: req.body.user });
    if (!user) return res.status(404).send('No user with matching id found.');

    let service = new Service({
      title: req.body.title,
      categories: categories,
      user: user,
      description: req.body.description,
      costs: {
        isMonthly: req.body.isMonthly,
        amount: req.body.amount,
      },
    });

    service = await service.save();

    res.send(service);
  })
);

//put
router.put(
  '/:id',
  [authenticate, validateRequest(validate), validateObjectId],
  asyncTemplate(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).send('No service with matching id found.');

    if (!authorize(service.user._id, res))
      return res.status(403).send('User not authorized.');

    const categories = await Category.getCategories(req.body.categoryIds);
    if (categories.length === 0 || categories[0] === null)
      return res.status(400).send('Invalid category.');

    const update = {
      title: req.body.title,
      categories: categories,
      description: req.body.description,
      costs: {
        isMonthly: req.body.isMonthly,
        amount: req.body.amount,
      },
    };
    await service.set(update).save();

    res.send(service);
  })
);

//delete
router.delete(
  '/:id',
  [authenticate, validateObjectId],
  asyncTemplate(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).send('No service with matching id found.');

    if (!authorize(service.user._id, res))
      return res.status(403).send('User not authorized.');

    service.remove();
    res.send(service);
  })
);

module.exports = router;
