var mongoose = require('mongoose');

var option = mongoose.Schema({
    value: String, 
    votes: { type: Number, default: 0 }
}, {_id: false});

var pollSchema = mongoose.Schema({
  _creator  : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question  : String,
  options   : [option]
});

var poll  = mongoose.model('Poll', pollSchema);
module.exports = poll;