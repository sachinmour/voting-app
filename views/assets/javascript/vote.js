$(function() {

    $("form#vote").submit(function(e) {

        var url = $('form#vote').attr('action'); // the script where you handle the form input.
        
        $.ajax({
               type: "POST",
               url: url,
               data: $("form#vote").serialize(), // serializes the form's elements.
               success: function(data)
               {
                   changeChart(data); // show response from the php script.
               }
             });
    
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $('form#vote button').prop('disabled', true);
    });

});