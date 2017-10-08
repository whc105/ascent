/*global $*/
$(function() {
    $('.class-box').on('click', function() {
        window.location = $(this).children('a').attr('href');
    });
    $.ajax({
        url: '/api/classes',
        method: 'GET',
        success: function (response) {
            response.forEach(function(name) {
                $('#input_class').append($('<option>', {
                    value: name.name,
                    text: name.name
                }));
            });
        }
    });
});