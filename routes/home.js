const asyncTemplate = require('../middleware/asyncTemplate');
const express = require('express');
const router = express.Router();

//home
router.get(
  '/',
  asyncTemplate((req, res) => {
    res.render('index');
  })
);

module.exports = router;
