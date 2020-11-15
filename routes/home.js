const asyncTemplate = require('../middleware/asyncTemplate');
const express = require('express');
const router = express.Router();

//home
router.get(
  '/',
  asyncTemplate((req, res) => {
    res.render('index', {
      title: 'services-rest-api',
      message: 'Testpage Services Rest API',
      listTitle: 'Endpoints:',
      list: ['user', 'service', 'rental', 'return', 'auth'],
    });
  })
);

module.exports = router;
