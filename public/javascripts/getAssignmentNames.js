/* global $*/
$(function() {
    getAssignments();
});

function getAssignments(className) {
    $.ajax({
        url: '/classes/' + $('.classID').text() + '/removeAssignment/getAssignmentName',
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