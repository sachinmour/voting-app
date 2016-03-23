$(function() {
  var component = $('<input type="text" name="option" class="short" required>');
  $("#authenticated a:nth-child(3)").click(function() {
    $('#dropdown').toggleClass("hidden");
  });
  $('button.small-button:nth-child(2)').on('click', function(event) {
    event.preventDefault();
    component.clone().appendTo('.form-group:nth-child(2)');
  });
  $('button.small-button:nth-child(1)').on('click', function(event) {
    event.preventDefault();
    var remove = $('input.short');
    if (remove.length > 2) {
      remove.last().remove();
    }
  });
});