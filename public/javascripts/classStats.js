/*global $*/
/*global Chart*/

var generalStatisticsChart;
var assignmentAveragesChart;
var assignmentGrowthChart;

$(function() {
    initializeCharts();
    var classData;
    var assignmentData;
    $.ajax({ //Pulls the class data from the classes collectiion
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
    classData = classData[0]; //General Analysis regarding student, teacher, and assignment count
    var studentCount = classData.students.length;
    var assignmentCount = classData.assignments.length;
    var teacherCount = classData.teacher.length;
    var counters = [studentCount, assignmentCount, teacherCount];
    generalStatisticsChart.data.datasets[0].data = counters;
    generalStatisticsChart.update();
    
    $('#ratio').text(`${studentCount/teacherCount} Students Per Teacher`); //Calculates student to teacher ratio
    
    //Filters all the assignment data
    assignmentData = assignmentData.filter(function(assignment) {
        return assignment.classID == classID;
    });
    
    
    //Pushes all the assignment names to the label
    clearFields(assignmentAveragesChart);
    assignmentData.forEach(function(assignment) {
        assignmentAveragesChart.data.labels.push(assignment.assignmentName);
        if ('avg' in assignment && assignment.avg != null) {
            assignmentAveragesChart.data.datasets[0].data.push((assignment.avg * 100).toFixed(3));
        } else {
            assignmentAveragesChart.data.datasets[0].data.push(0);
        }
    });
    assignmentAveragesChart.update();
    
    assignmentData = sortDate(assignmentData);
    
    //Calculates data for assignment growth chart
    clearFields(assignmentGrowthChart);
    assignmentData.forEach(function(assignment) {
        assignmentGrowthChart.data.labels.push(`${assignment.date} ${assignment.assignmentName}`);
        assignmentGrowthChart.data.datasets[0].data.push((assignment.avg * 100).toFixed(3));
    });
    assignmentGrowthChart.update();
    
    
    //console.log(assignmentData);
}

function initializeCharts() { //Initializes Charts
    generalStatisticsChart = new Chart($('#general-chart'), {
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
    assignmentAveragesChart = new Chart($('#assignment-chart'), {
        responsive: true,
        type: 'horizontalBar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Assignment Averages'
            },
            legend: {
                display: false
            }
        }
    });
    assignmentGrowthChart = new Chart($('#assignment-growth-chart'), {
        responsive: true,
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                borderColor: '#3e95cd',
                pointBackgroundColor: 'white',
                backgroundColor: ['rgba(40, 165, 255, 0.5)']
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            },
            title: {
                display: true,
                text: 'Assignment Averages Change Over Time'
            },
            legend: {
                display: false
            }
        },
    });
    
}

function changeHeader() { //Changes the header to the right class
    var className = $(`#class-list option:selected`).html();
    var classID = $(`#class-list`).val();
    $('#class-name').text(`${className}`);
    return classID;
}

function clearFields(chart) { //Clears the chart
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
}

function sortDate(assignmentData) {
    assignmentData.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a - b;
    });
    return assignmentData;
}