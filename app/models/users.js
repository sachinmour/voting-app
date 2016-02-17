var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Poll = require('./polls');
// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.createPoll = function() {
    var sme = new Poll({ _creator: this._id, question: "How many people", options: [{value: 4, votes: 2}, {value: 5, votes: 7}] });
    sme.save();
    console.log(sme);
};

userSchema.methods.polls = function(cb) {
    return Poll.find({ _creator: this._id }).exec(cb);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);