const morgan = require('morgan');
const config = require('config');
const winston = require('winston');

module.exports = function (app) {
  const env = app.get('env');
  winston.log('info', `app name: ${config.get('name')}`);
  winston.log('info', `mail server: ${config.get('mail.host')}`);
  winston.log('info', `NODE_ENV: ${env}`);
  if (config.has('mail.password'))
    winston.log('info', `mail password: ${config.get('mail.password')}`);
  if (env === 'development') {
    app.use(morgan('tiny'));
    winston.log('info', 'morgan enabled...');
  }
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey not set.');
  }
};
