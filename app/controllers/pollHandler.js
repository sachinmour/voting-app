var Poll = require('../models/polls');

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

module.exports = function() {
    
    this.createPoll = function(req, res) {
        
        var question = req.body.question;
        if (/^\s*$/.test(question)) {
            res.render('static_pages/new_poll.jade', { message: 'Question can\'t be blank' });
            return;
        }
        
        var option = req.body.option.filter(function(value) {
            return !(/^\s*$/.test(value));
        });
        
        if (option.length < 2) {
            res.render('static_pages/new_poll', {message: 'Minimum of two options are needed'});
            return;
        }
        if (hasDuplicates(option)) {
            res.render('static_pages/new_poll', {message: 'Duplicate options not allowed'});
            return;
        }
        
        var newPoll = new Poll();
        newPoll._creator = req.user._id;
        newPoll.question = question;
        for (var index in option) {
            var option_instance = { value: option[index] };
            newPoll.options.push(option_instance);
        }
        newPoll.save(function(err, poll) {
            if (err)
                throw err;
            res.redirect('/poll/' + poll.id);
        });
        
    };
    
};