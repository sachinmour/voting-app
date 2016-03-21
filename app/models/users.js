var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Poll = require('./polls');
// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        name         : {type: String,
                        required: [true, 'Name is required']
                        },
        email        : {type: String,
                        required: [true, 'Email is required']
                        },
        password     : {type: String,
                        required: [true, 'Password is required']
                        }
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

userSchema.methods.polls = function(cb) {
    return Poll.find({ _creator: this._id }).exec(cb);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);