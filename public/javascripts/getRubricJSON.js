/*global $*/
//Rubric Getter Limitations - No duplicate topic names

//USED ONLY IN ASSESSMENT.JADE
$(function() {
    if ($('.rubric_grading').length != 0) {
        getGrades();
    }
});

function getGrades() {
    var assignmentName = $('assignmentname').text();
    var className = $('classname').text();
    $.ajax({
        url: '/rubrics/getGrades',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({assignmentName:assignmentName, className:className}),
        success: function(response) {
            for (var count = 0; count < response.studentData.length; count++) {
                if (response.studentData[count].grades == -1) {
                    $(`li#${response.studentData[count].id}`).append('<li>Grade: Not Submited</li>');
                } else {
                    $('li#' + response.studentData[count].id).append('<li> Grade: ' + response.studentData[count].grades + '</li>');
                }
                if (response.studentData[count].overAllComments === '') {
                    $('li#' + response.studentData[count].id).append('<li>No Overall Comments Are Entered</li>');
                }
                else {
                    $('li#' + response.studentData[count].id).append('<li>' + response.studentData[count].overAllComments + '</li>');
                }
                $('li#' + response.studentData[count].id).append('<li>Topic Scoring<ul id=scoring></ul></li>');
                for (var topicCount = 0; topicCount < response.studentData[count].scoring.length; topicCount++) {
                    if (response.studentData[count].scoring[topicCount].score == null) {
                        $('li#' + response.studentData[count].id).children().children('#scoring').append(
                        '<li ' + 'id=' + response.studentData[count].scoring[topicCount].topic + '>' + response.studentData[count].scoring[topicCount].topic 
                        +'</li>');
                    }
                    else {
                        $('li#' + response.studentData[count].id).children().children('#scoring').append(
                            '<li ' + 'id=' + response.studentData[count].scoring[topicCount].topic + '>' + response.studentData[count].scoring[topicCount].topic + ': '
                            + response.studentData[count].scoring[topicCount].score
                            +'<ul id=' + response.studentData[count].scoring[topicCount].topic + '></ul></li>'
                        );
                    }
                    for (var commentCount = 0; commentCount < response.studentData[count].scoring[topicCount].comments.length; commentCount++) {
                        $('li#' + response.studentData[count].id).children().children('#scoring').children('#' + response.studentData[count].scoring[topicCount].topic)
                        .append(response.studentData[count].scoring[topicCount].comments[commentCount]);
                        $('li#' + response.studentData[count].id).children().children('#scoring').children('#' + response.studentData[count].scoring[topicCount].topic)
                        .append('<br>');
                    }
                }
            }
        }
    });
}