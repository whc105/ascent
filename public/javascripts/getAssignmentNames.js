/* global $*/
$(function() {
    getAssignments();
});

function getAssignments() {
    var classID = $('.classID').text()
    $.ajax({
        url: '/api/classes/getAssignmentNames/' + classID,
        method: 'GET',
        success: function (response) {
            response.forEach(function(assignment) {
                $('#input_assignment').append($('<option>', {
                    value: assignment.assignmentName,
                    text: assignment.assignmentName
                }));
            });
        }
    });
}