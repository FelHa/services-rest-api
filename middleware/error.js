const winston = require('winston');

module.exports = function(err, req, res, next){
    winston.log('error', 'catched in error-middleware: ', err.message);
    res.status(500).send('Something failed.');
}