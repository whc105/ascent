/*global $*/
$(function(){
    addSection();
    saveRubric();
});

function addSection() {
    //Adds a new row using the template row as reference
    var rowCount = 1;
    $('.add-row').click(function() {
        var rowID = 'row' + rowCount;
        $('tbody').append($('#row-templates').clone().attr('id', rowID));
        $(`#${rowID} #col0`).append(`<input id=topic${rowCount} name='topic' placeholder='Topic'>`);
        $(`#${rowID} #col0`).append(`<input type='text' id=score${rowCount} readonly style='border:0; color:#1d89ff; font-weight:bold;'><br>`);
        $(`#${rowID} #col0`).append(`<div id=slider${rowCount}/>`);
        createSliders(rowCount);
        rowCount++;
    });
    
    //Adds a new column to the entire table
    var colCount = 1;
    $('.add-col').click(function(){
        var columnCounter = 'col' + colCount;
        $('#row-templates').append(
            `<td id=${columnCounter}>
            <button class='bttn-unite bttn-xs bttn-primary add-comment' onclick='addComment(this)'>Add Comment</button>
            </td>`
        ); //Adds to template row
        
        $('#scores').append(
            `<th id=${columnCounter}>
            <input id=scoring-title${colCount} name='scores' placeholder='Scoring Title'>
            </th>`
        ); //Adds to scoring
        
        for (var count = 1; count <= rowCount; count++) {
            $(`#row${count}`).append(`<td id=${columnCounter}><button class='bttn-unite bttn-xs bttn-primary add-comment' onclick='addComment(this)'>Add Comment</button></td>`);
        } //Adds to the rest
        colCount++;
    });
}


function addComment(pointer) {
    var textAreaCount = ($(pointer).parent().children().length + 1)/2;
    $(pointer).parent().prepend(`<textarea id=comment${textAreaCount}/><br>`);
}

function createSliders(rowCount) {
    $(`#score${rowCount}`).val('Points Available:' + 5);
    $(`#slider${rowCount}`).slider({
        range: 'max',
        min: 1,
        max: 10,
        value: 5,
        slide: function(event, ui) {
            $(`#score${rowCount}`).val('Points Available:' + ui.value);
        }
    });
}

function saveRubric() {
    var rubricJSON = {rubricName: null, rubric: []};
    $('#save-rubric').click(function() {
        var rowLength = $('tbody tr').length - 2;
        var colLength = $('#row-templates td').length - 1;
        
        rubricJSON.rubricName = $('#title').val(); //Rubric Name
        for (var topicCount = 1; topicCount <= rowLength; topicCount++) {
            var topic = $(`#topic${topicCount}`).val(); //Gets topic name
            
            var parsePoint = $(`#score${topicCount}`).val(); //Gets score available
            var pointsAvailable = parsePoint.substring(parsePoint.indexOf(':') + 1);
            
            var grade = [];
            
            for (var columnCount = 1; columnCount <= colLength; columnCount++) {
                var score = colLength - columnCount;
                var scoringTitle = $(`#scoring-title${columnCount}`).val();
                var comments = [];
                
                var commentCount = ($(`#row${topicCount} #col${columnCount}`).children().length - 1)/2;
                for (var count = commentCount; count >= 1; count--) { //Puts each comment into an array
                    var comment = $(`#row${topicCount} #col${columnCount} #comment${count}`).val();
                    if (comment) {
                        comments.push(comment);
                    }
                }
                grade.push({score:score, scoringTitle:scoringTitle, comments:comments})
            }
            rubricJSON.rubric.push({topic:topic, points:pointsAvailable, grade: grade})
        }
        $.ajax({
            url: '/rubrics/rubricCreator',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(rubricJSON),
            success: function(response) {
                window.location.href = response.redirect;
            }
        });
    });
}