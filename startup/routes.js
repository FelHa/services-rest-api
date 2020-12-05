const express = require('express');
const helmet = require('helmet');
const services = require('../routes/services');
const categories = require('../routes/categories');
const subscriptions = require('../routes/subscriptions');
const users = require('../routes/users');
const home = require('../routes/home');
const auths = require('../routes/auths');
const cancelations = require('../routes/cancelations');
const errorRequestPipeline = require('../middleware/errorRequestPipeline');

module.exports = function (app) {
  //middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(helmet());
  //   app.use(controlOrigins);

  //router
  app.use('/api/services', services);
  app.use('/api/categories', categories);
  app.use('/api/subscriptions', subscriptions);
  app.use('/api/users', users);
  app.use('/api/auth', auths);
  app.use('/api/cancelations', cancelations);
  app.use('/', home);

  //errorhandler as last middleware
  app.use(errorRequestPipeline);
};
