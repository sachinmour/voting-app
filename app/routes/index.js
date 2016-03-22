'use strict';
var Poll = require('../models/polls');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        Poll.find({}, 'question', function(err, data) {
            if (err) throw err;
            var user = undefined;
            if (req.isAuthenticated()) {
                user = req.user;
            }
            res.render('static_pages/index.jade', {data: data, user: user}); // load the index.jade file
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('static_pages/signin.jade', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('static_pages/signup.jade', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('static_pages/profile.jade', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    app.get('/poll/new', isLoggedIn, function(req, res) {
        res.render('static_pages/new_poll.jade', {
            user: req.user
        });
    });
    
    app.get('/poll/:id', isLoggedIn, function(req, res) {
        
        req.user.polls(function(err, polls) {
            if (err) throw err;
            var x = polls;
            console.log(x[0].options);
        });
        console.log(req.user.id);
        res.end('hello');
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}