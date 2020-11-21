const winston = require('winston');

/* Handling errors related to application startup und running state*/

module.exports = function () {
  //add error handler for sync uncaught exceptions
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  //add error handler for async unhandled rejection
  process.on('unhandledRejection', (err) => {
    console.log(
      'unhandelRejection catched in logging.js -> handing error over to winston...'
    );
    throw err;
  });
};
