/*global $*/
/*global Chart*/

var generalStatistics;

$(function() {
    initializeCharts();
    var classData;
    var assignmentData;
    $.ajax({
        url: '/api/classes',
        method: 'GET',
        success: function(response) {
            classData = response;
            for(var classCount = 0; classCount < classData.length; classCount++){
                $('#class-list').append($('<option>', {
                    value: classData[classCount].id,
                    text: classData[classCount].name
                }));
            }
        }
    }).done(function() {
        $.ajax({
            url: '/api/assignments',
            method: 'GET',
            success: function(response) {
                assignmentData = response;
            }
        });
    }).done(function() {
        $('#class-list').change(function() {
            var classID = changeHeader();
            basicAnalysis(classID, classData, assignmentData);
        });
    });
});

function basicAnalysis(classID, classData, assignmentData) { //General Stats
    classData = classData.filter(function(classObject) { //Filters the array so it's only the given classID
        return classObject.id == classID;
    });
    classData = classData[0];
    var studentCount = classData.students.length;
    var assignmentCount = classData.assignments.length;
    var teacherCount = classData.teacher.length;
    var counters = [studentCount, assignmentCount, teacherCount];
    generalStatistics.data.datasets[0].data = counters;
    generalStatistics.update();
    
    assignmentData = assignmentData.filter(function(assignment) {
        return assignment.classID == classID;
    });
    console.log(assignmentData);
}

function changeHeader() {
    var className = $(`#class-list option:selected`).html();
    var classID = $(`#class-list`).val();
    $('#class-name').text(`${className}`);
    return classID;
}

function initializeCharts() { //Initializes Charts
    generalStatistics = new Chart($('#general-chart'), {
        responsive: true,
        type: 'horizontalBar',
        data: {
            labels: ['Students', 'Assignments', 'Teachers'],
            datasets: [{
                data: [],
                backgroundColor: ['rgba(40, 165, 255, 0.5)', 'rgba(255, 40, 101, 0.5)', 'rgba(255, 226, 40, 0.5)']
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Amount of Students, Assignments, Teachers'
            },
            legend: {
                display: false
            }
        }
    });
}