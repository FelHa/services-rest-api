const winston = require('winston');
const app = require('./app');

//start server
const port = process.env.port || 3000;
app.listen(port, () => {
    winston.log('info', `listening on port ${port}...`);
});