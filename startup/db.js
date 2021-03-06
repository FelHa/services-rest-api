const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
  //connect to mongodb
  const db = config.get('db.connection');
  const user = config.get('db.user');
  const pw = config.get('db.pw');

  mongoose
    .connect(`mongodb+srv://${user}:${pw}${db}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.log('info', `Connected to ${db}`));
};
