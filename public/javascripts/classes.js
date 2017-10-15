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


function submitNewClass() {
    var className = $('#input_name').val();
    var subject = $('#input_subject').val();
    var year = $('#input_year').val();
    var classData = {name: className, subject: subject, year: year};
    $.ajax({
        url: '/api/classes/newClass',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(classData),
        success: function (response) {
            window.location.replace('/classes');
        }
    });
}
