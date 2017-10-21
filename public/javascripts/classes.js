/*global $*/
$(function() {
    $('.class-box').on('click', function() {
        window.location = $(this).children('a').attr('href');
    });
    $.ajax({
        url: '/api/classes',
        method: 'GET',
        success: function (response) {
            //Append to the add/remove class select-inputs
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

function submitRemoveClass() {
    var className = {name: $('#input_class').val()};
    $.ajax({
        url: '/api/classes/removeClass',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(className),
        success: function(response) {
            window.location.replace('/classes');
        }
    })
    
}