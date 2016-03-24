'use strict';
var Poll = require('../models/polls');
var PollHandler = require('../controllers/pollHandler.js');
var pollHandler = new PollHandler();
var mongoose = require('mongoose');

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
        successRedirect : '/poll/new', // redirect to the secure profile section
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
    
    app.post('/poll/new', isLoggedIn, function(req, res) {
        pollHandler.createPoll(req, res);
    });
    
    app.get('/poll/:id', function(req, res) {
        
        var id = req.params.id;
        if (mongoose.Types.ObjectId.isValid(id)) {
            Poll.findOne({_id: id}, function(err, data) {
                if (err) throw err;
                var labels = [];
                var question = data.question;
                var values = [];
                for (var i = 0; i<data.options.length; i++ ) {
                    labels.push(data.options[i].value);
                    values.push(data.options[i].votes);
                }
                res.render('static_pages/poll.jade', {labels: JSON.stringify(labels), values: JSON.stringify(values), user: req.user, question: question, id: data._id}); // load the index.jade file
            });
        } else {
            res.redirect('/');
        }
    });
    
    app.post('/vote/:id', function(req, res) {
        var id = req.params.id;
        if (mongoose.Types.ObjectId.isValid(id)) {
            Poll.findOne({_id: id}, function(err, poll) {
                if (err) throw err;
                for (var i in poll.options) {
                    if (poll.options[i].value === req.body.option) {
                        poll.options[i].votes += 1;
                        poll.save(function(err, poll) {
                            if (err) throw err;
                            res.json(poll.options[i]);
                        });
                        return;
                    }
                }
            });
        } else {
            res.redirect('/');
        }
    });
    
    app.get('/mypolls',isLoggedIn, function(req, res) {
        req.user.polls(function(err, data) {
            if (err) throw err;
            console.log(data);
            res.render('static_pages/my_poll.jade', {data: data, user: req.user});
        });
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