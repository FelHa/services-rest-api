const asyncTemplate = require('../middleware/asyncTemplate');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { validate } = require('../models/auth');

//post
router.post(
  '/',
  asyncTemplate(async (req, res) => {
    const { error } = validate(req);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();

    res.send(token);
  })
);

module.exports = router;
