/*global $*/
/*global Chart*/

var generalStatisticsChart;
var assignmentAveragesChart;
var assignmentGrowthChart;
var assignmentComparisonChart;

$(function() {
    initializeCharts();
    var classData;
    var assignmentData;
    var rubricData;
    $.ajax({ //Pulls the class data from the classes collectiion
        url: '/api/classes',
        method: 'GET',
        success: function(response) {
            classData = response;
            classData.forEach(function(classItem) {
                $('#class-list').append($('<option>', {
                    value: classItem.id,
                    text: classItem.name
                }));
            });
        }
    }).done(function() {
        $.ajax({ //Pulls from assignment collection
            url: '/api/assignments',
            method: 'GET',
            success: function(response) {
                assignmentData = response;
            }
        });
    }).done(function() {
        $.ajax({ //Pulls from rubric collection
            url: '/api/rubrics',
            method: 'GET',
            success: function(response) {
                rubricData = response;
                rubricData.forEach(function(rubric) {
                    $('#rubric-select').append($('<option>', {
                        value: rubric.id,
                        text: rubric.rubricName
                    }));
                });
            }
        });
    }).done(function() {
        $('#class-list').change(function() {
            $('.charts').show();
            var classID = changeHeader();
            basicAnalysis(classID, classData, assignmentData);
        });
        $('#execute-analysis').click(function() {
            if ($('#assignment-1').val() == $('#assignment-2').val()) {
                $('#same-assignment-error').show();
            } else {
                $('#same-assignment-error').hide();
                assignmentComparisonAnalysis($(`#class-list`).val(), classData, assignmentData);
            }
        });
        $('#compare-derivative').click(function() {
            
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
    
    //Clears the assignment select and updates it with a new class assignments
    $('#rubric-select').change(function() {
        $('.assignment-select option').remove();
        var rubricID = $('#rubric-select').val();
        assignmentData.forEach(function(assignment) {
            if (assignment.rubricID == rubricID){
                $('.assignment-select').append($('<option>', {
                    value: assignment.id,
                    text: assignment.assignmentName
                }));
            }
        });
    });
    
    //Pushes all the assignment names to the label
    clearFields(assignmentAveragesChart);
    $('#start-assignment option').remove();
    assignmentData.forEach(function(assignment) {
        if ('avg' in assignment && assignment.avg != null) {
            assignmentAveragesChart.data.labels.push(assignment.assignmentName);
            assignmentAveragesChart.data.datasets[0].data.push((assignment.avg * 100).toFixed(3));
        }
    });
    var generatedRGBA = generateRGBA(assignmentData.length);
    assignmentAveragesChart.data.datasets[0].backgroundColor = generatedRGBA;
    assignmentAveragesChart.data.datasets[0].borderColor = generateRGBAPureAlpha(generatedRGBA);
    assignmentAveragesChart.update();
    
    //Sorts the assignments by date
    assignmentData = sortDate(assignmentData);
    var position = 0;
    
    //Calculates data for assignment growth chart
    clearFields(assignmentGrowthChart);
    assignmentData.forEach(function(assignment) {
        if (assignment.avg != null) {
            assignmentGrowthChart.data.labels.push(`${assignment.date} ${assignment.assignmentName}`);
            assignmentGrowthChart.data.datasets[0].data.push((assignment.avg * 100).toFixed(3));
            
            $('#start-assignment').append($('<option>', {
                value: position,
                text: assignment.assignmentName
            }));
        }
        position++;
    });
    assignmentGrowthChart.update();
    
    //Calculates Mean Value Theorem where T = Days
    var timeBetweenDates = new Date(assignmentData[assignmentData.length-1].date) - new Date(assignmentData[0].date);
    timeBetweenDates = timeBetweenDates/86400000;
    var gradeDifference = assignmentData[assignmentData.length-1].avg - assignmentData[0].avg;
    $('#assignment-derivative').text(`Assignment Performance Growth: ${(gradeDifference/timeBetweenDates).toFixed(3)}`);
    
    $('#start-assignment').change(function() { //Finds all the available assignments after the date
        $('#end-assignment option').remove();
        for (var count = $('#start-assignment').val(); count < assignmentData.length; count++) {
            if (assignmentData[count].avg != null && count != $('#start-assignment').val()) {
                $('#end-assignment').append($('<option>', {
                    value: count,
                    text: assignmentData[count].assignmentName
                }));
            }
        }
        
        $('#end-assignment').show();
        $('#compare-derivative').show();
        
        $('#compare-derivative').click(function() {
            timeBetweenDates = new Date(assignmentData[$('#end-assignment').val()].date) - new Date(assignmentData[$('#start-assignment').val()].date);
            timeBetweenDates = timeBetweenDates/86400000;
            var gradeDifference = assignmentData[$('#end-assignment').val()].avg - assignmentData[$('#start-assignment').val()].avg;
            $('#assignment-derivative').text(`Assignment Performance Growth: ${(gradeDifference/timeBetweenDates).toFixed(3)}`);
        });
    });
    
    
}

function initializeCharts() { //Initializes Charts
    generalStatisticsChart = new Chart($('#general-chart'), {
        responsive: true,
        type: 'horizontalBar',
        data: {
            labels: ['Students', 'Assignments', 'Teachers'],
            datasets: [{
                data: [],
                borderWidth: 1,
                backgroundColor: ['rgba(40, 165, 255, 0.2)', 'rgba(255, 40, 101, 0.2)', 'rgba(255, 226, 40, 0.2)'],
                borderColor: ['rgba(40, 165, 255, 1)', 'rgba(255, 40, 101, 1)', 'rgba(255, 226, 40, 1)']
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
                borderWidth: 1,
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
    assignmentComparisonChart = new Chart($('#assignment-comparison-chart'), {
        responsive: true,
        maintainAspectRatio: false,
        type: 'bar',
        data: {
            labels: [],
            datasets: [{borderWidth: 1},{borderWidth: 1}]
        },
        options: {
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Multi-Assignment Topic Comparisons'
            }
        },
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
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
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

function assignmentComparisonAnalysis(classID, classData, assignmentData) {
    classData = classData.filter(function(classObject) { //Filters the array so it's only the given classID
        return classObject.id == classID;
    });
    
    assignmentData = assignmentData.filter(function(assignment) { //Filters the assignment so it's only the assignments in the class
        return assignment.classID == classID;
    });

    var selectedAssignments = assignmentData.filter(function(selected) { //Filters the assignment so it's only the two selected assignments
        return selected.id == $('#assignment-1').val() || selected.id == $('#assignment-2').val();
    });
    
    var firstAssignmentScores = selectedAssignments[0].students.filter(function(students) { //Get all the graded students for assignment 1
        return students.grades != -1;
    });

    var secondAssignmentScores = selectedAssignments[1].students.filter(function(students) { //Get all the graded students for assignment 2
        return students.grades != -1;
    });
    
    var topicLength1 = firstAssignmentScores[0].scoring.length;
    var topicLength2 = secondAssignmentScores[0].scoring.length;
    var topicScores1 = new Array(topicLength1);
    var topicScores2 = new Array(topicLength2);
    var topicList = [];
    var backgroundColorT1 = [];
    var backgroundColorT2 = [];
    var borderColorT1 = [];
    var borderColorT2 = [];
    for (var topicCount = 0; topicCount < topicLength1; topicCount++) { //Calculates average per topic
        topicScores1[topicCount] = 0;
        topicList.push(firstAssignmentScores[0].scoring[topicCount].topic);
        firstAssignmentScores.forEach(function(assignment) {
            topicScores1[topicCount] += (assignment.scoring[topicCount].score/firstAssignmentScores.length);
        });
        topicScores1[topicCount] = (topicScores1[topicCount]*100).toFixed(3);
        backgroundColorT1.push('rgba(96, 205, 112, 0.2)');
        borderColorT1.push('rgba(96, 205, 112, 1)');
    }
    
    
    for (var topicCount = 0; topicCount < topicLength2; topicCount++) { //Calculates average per topic
        topicScores2[topicCount] = 0;
        secondAssignmentScores.forEach(function(assignment) {
            topicScores2[topicCount] += (assignment.scoring[topicCount].score /secondAssignmentScores.length);
        });
        topicScores2[topicCount] = (topicScores2[topicCount]*100).toFixed(3);
        backgroundColorT2.push('rgba(78, 129, 223, 0.2)');
        borderColorT2.push('rgba(78, 129, 223, 1)');
    }

    assignmentComparisonChart.data.labels = topicList;
    assignmentComparisonChart.data.datasets[0].label = selectedAssignments[0].assignmentName;
    assignmentComparisonChart.data.datasets[0].data = topicScores1;
    assignmentComparisonChart.data.datasets[0].backgroundColor = backgroundColorT1;
    assignmentComparisonChart.data.datasets[0].borderColor = borderColorT1;
    assignmentComparisonChart.data.datasets[1].label = selectedAssignments[1].assignmentName;
    assignmentComparisonChart.data.datasets[1].data = topicScores2;
    assignmentComparisonChart.data.datasets[1].backgroundColor = backgroundColorT2;
    assignmentComparisonChart.data.datasets[1].borderColor = borderColorT2;
    assignmentComparisonChart.update();
    
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

function generateRGBA(amount) { //Given an amount, return RGBA with alpha as .2
    var backgroundColor = [];
    for(var count = 0; count < amount; count++) {
        var rgba = `rgba(${(Math.floor(Math.random()*255))}, ${(Math.floor(Math.random()*255))}, ${(Math.floor(Math.random()*255))}, 0.2)`;
        backgroundColor.push(rgba);
    }
    return backgroundColor;
}

function generateRGBAPureAlpha(colorArray) { //Given an RGBA array, set return the same RGBA with alpha as 1
    colorArray = colorArray.map(function(rgba) {
        return rgba.substr(0, rgba.length-4) + '1)';
    });
    return colorArray;
}