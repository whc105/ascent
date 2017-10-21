/* global $*/
$(function() {
    $.ajax({
        url: '/api/rubrics',
        method: 'GET',
        success: function (response) {
            response.forEach(function(rubricName) {
                $('#rubricName').append($('<option>', {
                    value: rubricName.rubricName,
                    text: rubricName.rubricName
                }));
            });
        }
    });
});