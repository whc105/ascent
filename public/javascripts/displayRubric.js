/*global $*/
$(function() {
    searchRubric();
});

function searchRubric() { //Searches for Rubric in DB
    $('#search_rubric').on('submit', function(event) {
        event.preventDefault();
        var search = $('#rubricSearch');
        $.ajax({
            url: '/rubrics/getRubricJSON',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({rubricName:search.val()}),
            success: function(response) {
                $('tbody').empty();
                $('#submit_student').click();
                parseData(response[0], 'table');
                search.val('');
            }
        });
    });
}

function parseData(rubricObject, domReference) {
    var rubric = rubricObject.rubric;
    
    var theRubric = document.createElement('tbody');
    $(theRubric).append("<tr id='scores'>" +  "<th>" + rubricObject.rubricName + "</th>" + "</tr>"); //Creates rubric title
    
    var columnCount = rubric[0].grade.length;
    for (var columns = 0; columns < columnCount; columns++) { //Deploys all columns
        $(theRubric).children('#scores').append("<th> " + $(rubric[0].grade[columns])[0].scoringTitle + " Score:"  + (columnCount-columns-1) + "</th>");
    }
    
    var rowsCount = rubric.length;
    for (var rows = 0; rows < rowsCount; rows++) { //Deploys all rows
        $(theRubric).append(`<tr id=row${rows}><th>${rubric[rows].topic}<br>Points Available:${rubric[rows].points}</th></tr>`);
        for (var columns = 0; columns < columnCount; columns++) {
            $(theRubric).children(`#row${rows}`).append(`<th id=comments${columns}></th>`);
            for (var comments = 0; comments < rubric[rows].grade[columns].comments.length; comments++) {
                $(theRubric).children(`#row${rows}`).children(`#comments${columns}`).append(rubric[rows].grade[columns].comments[comments] + '<br>');
            }
        }
    }
    
    $(domReference).html(theRubric);
}

function printPage(){
    window.print();
}