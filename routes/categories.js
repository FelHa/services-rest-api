const asyncTemplate = require('../middleware/asyncTemplate');
const authenticate = require('../middleware/authenticate');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { Category, validate } = require('../models/category');
const validateRequest = require('../middleware/validateRequest');
const validateObjectId = require('../middleware/validateObjectId');

//get
router.get(
  '/',

  asyncTemplate(async (req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
  })
);

router.get(
  '/:id',
  [validateObjectId],
  asyncTemplate(async (req, res) => {
    const category = await Category.findById({ _id: req.params.id });
    if (!category)
      return res.status(404).send('No category with matching id found.');
    res.send(category);
  })
);

//post
router.post(
  '/',
  [authenticate, admin, validateRequest(validate)],
  asyncTemplate(async (req, res) => {
    const category = new Category(_.pick(req.body, 'name'));
    await category.save();
    res.send(category);
  })
);

//put
router.put(
  '/:id',
  [authenticate, admin, validateRequest(validate), validateObjectId],
  asyncTemplate(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).send('No category with matching id found.');
    await category.set({ name: req.body.name }).save();
    res.send(category);
  })
);

//delete
router.delete(
  '/:id',
  [authenticate, admin, validateObjectId],
  asyncTemplate(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).send('No category with matching id found.');
    category.remove();
    res.send(category);
  })
);

module.exports = router;
