/*global $*/
$(function() {
    selectOnClick();
    searchStudent();
    postStudentGrade();
    rubricVisibility();
});

function selectOnClick() {
    $('table').on('click', 'p', function() {
        if (!$(this).hasClass('selected')) {
            $(this).attr('class', 'selected').css({
                'border': 'solid',
                'border-color': '#7EC0EE'
            });
        } else {
            $(this).attr('class', '').css({
                'border': 'solid',
                'border-color': '#ffffff'
            });
        }
    });
}

function displayPerStudent(studentCount) {
    var template = $('#rubric_grading');
    for (var count = 0; count < studentCount; count++) {
        template.clone().appendTo($(`#${count}ID .list`));
    }
}

function postStudentGrade() {
    $('.submit_rubric_grade').on('click', function(event) {
        var assignmentName = $('assignmentName').text();
        
        var rubric = $(this).parent().children('li');
        var studentID = rubric.attr('id'); //Student ID
        var overallComment = $(this).parent().children('textarea').val(); //Text Area Value
        var rubricScore = rubric.children('table').children('tbody'); //Gets entire rubric body
        
        var trCount = rubricScore.find('tr').length - 1; //Gets total rows
        
        var columnCount = rubricScore.find('#scores th').length - 1; //Gets column count
        
        var topic = rubricScore.children('tr:first');
        var topicGrades = []; //Grades recieved per topic
        var allComments = []; //All the comments per topic
        
        var score = [];
        for (var colCount = columnCount - 1; colCount >= 0; colCount--) {
            score.push(colCount);
        }
        var topicList = [];
        var totalPoints = 0;
        var totalScored = 0;
        for (var count = 0; count < trCount; count++) { //Displays all the class names per row
            topicList.push($(`#topic${count}`).text());
            var pointsAvailable = parseInt($(`#points${count}`).text().substring($(`#points${count}`).text().indexOf(':') + 1)); //Gets points available
            totalPoints = totalPoints + pointsAvailable;
            
            var rowComments = [];
            var scored = 0;
            for (var colCount = 0; colCount < columnCount; colCount++) {
                var selected = 0;
                var commentsInCell = rubricScore.children(`#row${count}`).children(`#comments${colCount}`).children('p');
                for (var commentCount = 0; commentCount < commentsInCell.length; commentCount++) { //Adds all the selected comments
                    if ($(commentsInCell[commentCount]).attr('class') === 'selected') {
                        rowComments.push($(commentsInCell[commentCount]).text());
                        selected++;
                    }
                }
                selected = selected/commentsInCell.length;
                scored = scored + (selected*score[colCount]);
            }
            scored = (scored*pointsAvailable)/(columnCount-1); //Score Calculation
            totalScored = totalScored + scored;
            topicGrades.push(scored/pointsAvailable); //Stores all grades
            allComments.push(rowComments)
        }
        totalScored = totalScored/totalPoints;
        sendToDB(assignmentName, studentID, totalScored, overallComment, topicList, topicGrades, allComments);
    });
}

function sendToDB(assignmentName, studentID, totalScored, overallComment, topicList, topicGrades, allComments) {
    var studentGrade = JSON.stringify({assignmentName: assignmentName, id: studentID, grades: totalScored, overAllComments: overallComment, topicList: topicList, topicGrades: topicGrades, allComments: allComments});
    $.ajax({
        url: '/rubrics/gradeStudent',
        method: 'POST',
        contentType: 'application/json',
        data: studentGrade,
        success: function(response) {
            var responseData = response.resultString;
            $('#result' + studentID).text(responseData);
        }
    });
}

//Toggles visibility
function rubricVisibility() {
    $(document).on('click', '#visibilityToggle', function() {
        if ($(this).hasClass('btn btn-warning showing')) {
            $(this).parent().parent().children('textarea, .submit_rubric_grade').hide();
            $(this).parent().parent().children('li').children('table').hide();
            $(this).attr('class', 'btn btn-warning hiding');
            $(this).children('i').attr('class', 'fa fa-eye visibility');
            $(this).parent().children('li').show();
            $(this).parent().parent().parent().children('#data').show();
        }
        else {
            $(this).parent().parent().children('textarea, .submit_rubric_grade').show();
            $(this).parent().parent().children('li').children('table').show();
            $(this).attr('class', 'btn btn-warning showing');
            $(this).children('i').attr('class', 'fa fa-eye-slash visibility');
            $(this).parent().children('li').hide();
            $(this).parent().parent().parent().children('#data').hide();
        }
    });
}

//search function for grading list
function searchStudent() {
    $('#searchInput').on('keyup', function() {
        var query = $('#searchInput').val().toLowerCase().trim();
        console.log(query);
            
        $('#studentUL').children('.rubric_form_grade').each(function () {
            if(!this.name.toLowerCase().trim().includes(query)){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });
    });
}