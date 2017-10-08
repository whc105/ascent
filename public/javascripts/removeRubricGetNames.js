/*global $*/
$(function() {
    $.ajax({
        url: '/rubrics/getAllRubricNames',
        method: 'GET',
        success: function(response) {
            response.forEach(function(name) {
                $('#input_rubric').append($('<option>', {
                    value: name.rubricName,
                    text: name.rubricName
                }));
            });
        }
    });
});