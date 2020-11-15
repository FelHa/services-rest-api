const winston = require('winston');
const config = require('config');
require('winston-mongodb');

module.exports = function () {
  const db = config.get('db.connection');
  const pw = config.get('db.pw');
  const user = config.get('db.user');
  //add winston logger to mongodb
  winston.add(winston.transports.MongoDB, {
    db: `mongodb://${user}:${pw}${db}`,
    level: 'error',
  });

  //add error handler for sync uncaught exceptions
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  //add error handler for async unhandled rejection
  process.on('unhandledRejection', (err) => {
    throw err;
  });
};
