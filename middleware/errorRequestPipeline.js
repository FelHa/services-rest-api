const winston = require('winston');

/* Handling errors in the request processing pipeline */

module.exports = function (err, req, res, next) {
  winston.log('error', 'catched in error-middleware: ', err.message);
  res.status(500).send('Something failed.');
};
