const asyncTemplate = require('../middleware/asyncTemplate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Service, validate } = require('../models/service');
const validateRequest = require('../middleware/validateRequest');
const validateObjectId = require('../middleware/validateObjectId');
const { Category } = require('../models/category');

//get
router.get(
  '/',
  asyncTemplate(async (req, res) => {
    const services = await Service.find().sort('name');
    res.send(services);
  })
);

router.get(
  '/:id',
  validateObjectId,
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
  [auth, validateRequest(validate)],
  asyncTemplate(async (req, res) => {
    const categories = await Category.getCategories(req.body.categoryIds);
    if (categories.length === 0 || categories[0] === null)
      return res.status(400).send('Invalid category.');
    let service = new Service({
      title: req.body.title,
      categories: categories,
      monthlyRate: req.body.monthlyRate,
    });
    service = await service.save();
    res.send(service);
  })
);

//put
router.put(
  '/:id',
  [auth, validateRequest(validate), validateObjectId],
  asyncTemplate(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).send('No service with matching id found.');
    const categories = await Category.getCategories(req.body.categoryIds);
    if (categories.length === 0 || categories[0] === null)
      return res.status(400).send('Invalid category.');
    const update = {
      title: req.body.title,
      categories: categories,
      monthlyRate: req.body.monthlyRate,
    };
    await service.set(update).save();
    res.send(service);
  })
);

//delete
router.delete(
  '/:id',
  [auth, admin, validateObjectId],
  asyncTemplate(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).send('No service with matching id found.');
    service.remove();
    res.send(service);
  })
);

module.exports = router;
