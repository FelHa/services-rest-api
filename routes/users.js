const asyncTemplate = require('../middleware/asyncTemplate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../shared/authorize');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { User, validate } = require('../models/user');
const validateRequest = require('../middleware/validateRequest');
const validateObjectId = require('../middleware/validateObjectId');

//get
router.get(
  '/',
  [authenticate, admin],
  asyncTemplate(async (req, res) => {
    let users = await User.find().sort('name');
    users = users.map((user) => _.pick(user, ['_id', 'name', 'email']));
    res.send(users);
  })
);

router.get(
  '/me',
  [authenticate],
  asyncTemplate(async (req, res) => {
    const user = await User.findById({ _id: res.locals.token._id }).select(
      '-password'
    );

    if (!user) return res.status(404).send('No user with matching id found.');
    res.send(user);
  })
);

//post
router.post(
  '/',
  validateRequest(validate),
  asyncTemplate(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.send({ ..._.pick(user, ['_id', 'name', 'email']), token });
  })
);

//put
router.put(
  '/:id',
  [authenticate, validateRequest(validate), validateObjectId],
  asyncTemplate(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('No user with matching id found.');

    if (!authorize(user._id, res))
      return res.status(403).send('User not authorized.');

    const emailAlreadyUsed = await User.findOne({ email: req.body.email });
    if (emailAlreadyUsed)
      return res.status(400).send('Email adress already in use.');

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    await user
      .set(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']))
      .save();
    res.send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
  })
);

//delete
router.delete(
  '/:id',
  [authenticate, admin, validateObjectId],
  asyncTemplate(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('No user with matching id found.');
    user.remove();
    res.send(_.pick(user, ['_id', 'name', 'email']));
  })
);

module.exports = router;
