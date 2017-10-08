/* global $*/
$(function() {
    $.ajax({
        url: '/classes/' + $('.classID').text() + '/newAssignment/getRubricName',
        method: 'GET',
        success: function (response) {
            console.log('getting rubric');
            response.forEach(function(rubricName) {
                $('#rubricName').append($('<option>', {
                    value: rubricName.rubricName,
                    text: rubricName.rubricName
                }));
            });
        }
    });
});