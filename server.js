'use strict';
require('dotenv').config();

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    morgan = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    session = require("express-session");

var app = express();
mongoose.connect(process.env.MONGOLAB_URI);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());             //
app.use(bodyParser.urlencoded({         // get information from html forms    
  extended: true                        //
}));

app.set('view engine', 'jade'); // set up jade for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', saveUninitialized: true, resave: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/assets', express.static(process.cwd() + '/views/assets'));

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});