const express = require('express');
const app = express();

//logging errors
require('./startup/logging')();

//config
require('./startup/config')(app);

//create server & routes
require('./startup/routes')(app);

//create db connection
require('./startup/db')();

//template renderer
app.set('view engine','pug');
app.set('views','./views');

//joi
require('./startup/validation')();

module.exports = app;