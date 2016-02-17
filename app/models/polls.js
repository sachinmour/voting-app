var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
  _creator  : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question  : String,
  options   : [{ value: String, votes: { type: Number, default: 0 } }]
});

var poll  = mongoose.model('Poll', pollSchema);
module.exports = poll;