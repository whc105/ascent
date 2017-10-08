/*global $*/
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
        $(theRubric).append(`<tr id=row${rows}><th><h5 id=topic${rows}>${rubric[rows].topic}<h5 id=points${rows}>Points Available:${rubric[rows].points}</th></tr>`);
        for (var columns = 0; columns < columnCount; columns++) {
            $(theRubric).children(`#row${rows}`).append(`<th id=comments${columns}></th>`);
            for (var comments = 0; comments < rubric[rows].grade[columns].comments.length; comments++) {
                $(theRubric).children(`#row${rows}`).children(`#comments${columns}`).append('<p>' + rubric[rows].grade[columns].comments[comments] + '</p>');
            }
        }
    }
    $(domReference).html(theRubric);
}