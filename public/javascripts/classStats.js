/*global $*/
/*global Chart*/

$(function() {
    $.ajax({
        url: '/api/classes/identifySearch',
        method: 'GET',
        success: function(response) {
            var classIdentifiers = response;
            for(var classCount = 0; classCount < classIdentifiers.length; classCount++){
                $('#classList').append($('<option>', {
                    value: classIdentifiers[classCount].name,
                    text : classIdentifiers[classCount].name
                }));
            }
        }
    });
});