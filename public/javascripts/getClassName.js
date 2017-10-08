/* global $*/
$(function() {
    $.ajax({
        url: '/:className/newAssignment/getClassName',
        method: 'GET',
        success: function (response) {
            response.forEach(function(className) {
                $('#className').append($('<option>', {
                    value: className.name,
                    text: className.name
                }));
            });
        }
    });
});