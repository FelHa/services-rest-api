const express = require('express');
const helmet = require('helmet');
const services = require('../routes/services');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const home = require('../routes/home');
const auths = require('../routes/auths');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function (app) {
  //middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(helmet());
  //   app.use(controlOrigins);

  //router
  app.use('/api/services', services);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auths);
  app.use('/api/returns', returns);
  app.use('/', home);

  //errorhandler as last middleware
  app.use(error);
};
