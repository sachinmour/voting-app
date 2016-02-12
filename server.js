'use strict';

require('dotenv').config();

process.env.hist = new Array(10);

var express = require('express'),
    routes = require('./app/routes/index.js');
    
var app = express();

routes(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});