/*global $*/
/*global Chart*/

var studentsData;
var classesData;

$(function() {
    $.ajax({
        url:'/api/students',
        method: 'GET',
        success: function(students) {
            studentsData = students;
            $.ajax({
                url:'/api/classes',
                method: 'GET',
                success: function(classes) {
                    classesData = classes
                    aboveXSliderChart();
                    basicAnalysis();
                }
            });
        }
    });
});

function basicAnalysis() {
    
    var studentCount = studentsData.length;
    //students with grade count
    var eligibleTotalStudentCount = 0;
    //student average gpa
    var avgGPA = 0;
    //total student count
    var studentGradeLevel = [0,0,0,0];
    //student gender count
    var mCount = 0;
    var fCount = 0;
    //student SPED and ELL count
    var SPED = 0;
    var ELL = 0;
    var totalGPA = 0;
    
    //Report counter
    var troubleMakers = [0,0,0,0,0];
    
    //Pass vs Fail ratio
    var exceeding = 0;
    var meetingStandard = 0;
    var fail = 0;
    var approachingStandards = 0;
    
    //iterate through the student collection array
    for (var count = 0; count < studentsData.length; count++) {
        if(studentsData[count].gpa != null){
            totalGPA += Number(studentsData[count].gpa);
            eligibleTotalStudentCount++;
            
            //Counts Pass vs Fail
            if (studentsData[count].gpa > 90) {
                exceeding++;
            } else if (studentsData[count].gpa < 90 && studentsData[count].gpa >= 80) {
                meetingStandard++;
            } else if (studentsData[count].gpa < 80 && studentsData[count].gpa >= 70) {
                approachingStandards++;
            } else {
                fail++;
            }
        }
        if(studentsData[count].sped === 'y') {
            SPED++;
        }
        if(studentsData[count].ell === 'y'){
            ELL++;
        }
        if(studentsData[count].gender ==='M'){
            mCount++;
        } else if(studentsData[count].gender ==='F'){
            fCount++;
        }
        
        if(studentsData[count].grade === '9'){
           studentGradeLevel[0]++;
        } else if(studentsData[count].grade === '10'){
            studentGradeLevel[1]++;
        } else if(studentsData[count].grade === '11'){
            studentGradeLevel[2]++;
        } else if(studentsData[count].grade === '12'){
            studentGradeLevel[3]++;
        }
        
        if (studentsData[count].reportIDs.length == 0) {
            troubleMakers[0]++;
        } else if (studentsData[count].reportIDs.length == 1) {
            troubleMakers[1]++;
        } else if (studentsData[count].reportIDs.length == 2) {
            troubleMakers[2]++;
        } else if (studentsData[count].reportIDs.length == 3) {
            troubleMakers[3]++;
        } else if (studentsData[count].reportIDs.length >= 4) {
            troubleMakers[4]++;
        }
        
    }
    avgGPA = totalGPA/eligibleTotalStudentCount;
    
    $('.studentCount').text('There are ' + studentsData.length + ' students');
    $('.classCount').text('There are ' + classesData.length + ' classes');
    $('.averageGPA').text("The school's average is " + avgGPA.toFixed(3));
    $('.genderCount').text('Male students: ' + mCount + ' Female students: ' + fCount);
    $('.spedCount').text('Number of SPED students: ' + SPED);
    $('.ellCount').text('Number of ELL students: ' + ELL);
    
    var genderChart = $('#genderChart');
    var genderPieChart = new Chart(genderChart,{
        responsive:true,
        type: 'pie',
        data : {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [mCount, fCount],
                backgroundColor: [
                    'rgba(4, 181, 205, 0.2)',
                    'rgba(253, 155, 242, 0.2)'],
                borderColor: [
                    'rgba(4, 181, 205, 1)',
                    'rgba(255, 52, 184, 1)'],
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    
    //SPED chart
    var spedChart = $('#spedChart');
    var spedPieChart = new Chart(spedChart,{
        responsive: true,
        type: 'pie',
        data : {
            labels: ['Special Education', 'Non-SPED'],
            datasets: [{
                data: [SPED, studentCount - SPED],
                backgroundColor: [
                    'rgba(26, 244, 135, 0.2)',
                    'rgba(11, 171, 234, 0.2)'],
                borderColor: [
                    'rgba(26, 244, 135, 1)',
                    'rgba(11, 171, 234, 1)']
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    
    //ELL chart
    var ellChart = $('#ellChart');
    var ellPieChart = new Chart(ellChart,{
        responsive: true,
        type: 'pie',
        data : {
            labels: ['ELL', 'Non-ELL'],
            datasets: [{
                data: [ELL, studentCount - ELL],
                backgroundColor: [
                    'rgba(234, 11, 85, 0.2)',
                    'rgba(199, 199, 245, 0.2)'],
                borderColor: [
                    'rgba(234, 11, 85, 1)',
                    'rgba(199, 199, 245, 1)']
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    
    //Grade level chart
    var gradeChart = $('#gradeChart');
    var gradePolarChart = new Chart(gradeChart, {
        responsive: true,
        type: 'polarArea',
        data : {
            labels: ['Grade 9','Grade 10','Grade 11','Grade 12'],
            datasets: [{
                data: studentGradeLevel,
                backgroundColor: [
                    'rgba(84, 255, 207, 0.2)',
                    'rgba(255, 84, 132, 0.2)',
                    'rgba(255, 207, 84, 0.2)',
                    'rgba(84, 132, 255, 0.2)'],
                borderColor: [
                    'rgba(84, 255, 207, 1)',
                    'rgba(255, 84, 132, 1)',
                    'rgba(255, 207, 84, 1)',
                    'rgba(84, 132, 255, 1)']
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    
    //Reports
    var reportChart = $('#reportChart');
    var reportPieChart = new Chart(reportChart, {
        responsive: true,
        type: 'pie',
        data : {
            labels: ['0 Report','1 Report','2 Reports','3  Reports', '4 or more Reports'],
            datasets: [{
                data: troubleMakers,
                backgroundColor: [
                    'rgba(84, 255, 207, 0.2)',
                    'rgba(255, 84, 132, 0.2)',
                    'rgba(255, 207, 84, 0.2)',
                    'rgba(84, 132, 255, 0.2)',
                    'rgba(255, 255, 255, 0.2)'],
                borderColor: [
                    'rgba(84, 255, 207, 1)',
                    'rgba(255, 84, 132, 1)',
                    'rgba(255, 207, 84, 1)',
                    'rgba(84, 132, 255, 1)',
                    'rgba(0, 0, 0, 1)']
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    
    //Pass vs Fail chart
    //Reports
    var passChart = $('#passChart');
    var passPieChart = new Chart(passChart, {
        responsive: true,
        type: 'pie',
        data : {
            labels: ['Exceeding', 'Meeting Standards', 'Approaching Standards', 'Needs Support'],
            datasets: [{
                data: [exceeding, meetingStandard, approachingStandards, fail],
                backgroundColor: [
                    'rgba(84, 255, 207, 0.2)',
                    'rgba(255, 84, 132, 0.2)',
                    'rgba(255, 207, 84, 0.2)',
                    'rgba(84, 132, 255, 0.2)',
                    'rgba(255, 255, 255, 0.2)'],
                borderColor: [
                    'rgba(84, 255, 207, 1)',
                    'rgba(255, 84, 132, 1)',
                    'rgba(255, 207, 84, 1)',
                    'rgba(84, 132, 255, 1)',
                    'rgba(0, 0, 0, 1)']
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    calcStandardDeviation(studentsData, avgGPA);
}

//Calculates standard deviation
function calcStandardDeviation(studentList, averageGPA) {
    var studentGPAs = [];
    
    var average = averageGPA;
    var ksi = [];
    for (var count = 0; count < studentList.length; count++) {
        ksi.push(Math.pow(studentList[count].gpa - average, 2));
        studentGPAs.push(parseFloat(studentList[count].gpa));
    }
    
    var ksiTotal = 0; //Calculates ksi for standard deviation
    for (var count = 0; count < ksi.length; count++) {
        ksiTotal = ksiTotal + ksi[count];
    }
    ksiTotal = ksiTotal / ksi.length;
    
    var standardDeviation = Math.pow(ksiTotal, .5); //Calculates Standard Deviation
    $('.standardDeviation').text('Standard Deviation ' + standardDeviation.toFixed(3));
    
    studentGPAs = studentGPAs.sort(sortNumber);
    
    var lowestDeviation = Math.floor(Math.abs(average - studentGPAs[0]) / standardDeviation) * -1; //Calculates the maximum deviation less than avg
    
    var highestDeviation = Math.ceil(Math.abs(average - studentGPAs[studentGPAs.length-1]) / standardDeviation); //Calculates the maximum deviation more than avg
    
    var studentsPerDeviation = [];
    var labelDeviations = []; //Calculates deviation ranges
    for (var count = lowestDeviation; count <= highestDeviation; count++) {
        labelDeviations.push(count);
        studentsPerDeviation.push(0);
    }
    
    var counter = 0; //Does some deviation math to move students to certain deviations
    var outliers = Math.abs(average + (standardDeviation * labelDeviations[0]));
    
    var lessThan = studentGPAs.filter(function(result) {
        return result < outliers;
    });
    
    studentsPerDeviation[counter] = lessThan.length;
    
    for (var count = labelDeviations[0]; count < labelDeviations[labelDeviations.length-1]; count++) {
        counter++;
        var lowerEnd = Math.abs(average + (standardDeviation * count));
        var upperEnd = Math.abs(average + (standardDeviation * (count + 1)));
        for (var gpaCounter = 0; gpaCounter < studentGPAs.length; gpaCounter++) {
            if (studentGPAs[gpaCounter] >= lowerEnd && studentGPAs[gpaCounter] < upperEnd) {
                studentsPerDeviation[counter] = studentsPerDeviation[counter]+1;
            }
        }
    }
    
    var gpaStandardDeviation = $('#gpaDeviation');
    var deviationBarChart = new Chart(gpaStandardDeviation,{
        responsive: true,
        type: 'line',
        data : {
            labels: labelDeviations,
            datasets: [{
                data: studentsPerDeviation,
                backgroundColor: 'rgba(25, 202, 225, 0.2)',
                borderColor: 'rgba(25, 202, 225, 1)',
                label: 'GPA Deviation'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
}

//Above X GPA Chart
function aboveXSliderChart() {
    $('#amount').val('Less than 65%');
    var above = 0;
    var below = 0;
    for (var count = 0; count < studentsData.length; count++) {
        if (studentsData[count].gpa >= 65) {
            above++;
        } else {
            below++;
        }
    }
    var val = 65;
    var aboveX = $('#aboveXChart');
    var aboveXChart = new Chart(aboveX,{
        responsive:true,
        type: 'pie',
        data : {
            labels: ['More than or equal to ' + val + '%', 'Less ' + val + '%'],
            datasets: [{
                data: [above, below],
                backgroundColor: [
                    'rgba(4, 181, 205, 0.2)',
                    'rgba(253, 155, 242, 0.2)'],
                borderColor: [
                    'rgba(4, 181, 205, 1)',
                    'rgba(255, 52, 184, 1)'],
            }]
        },
        options: {
            legend: {
                labels: {
                    boxWidth: 15
                }
            }
        }
    });
    //Slider mechanism
    $('#slider').slider({
        min: 0,
        max: 100,
        value: 65,
        slide: function(event, ui) {
            $('#amount').val('Less than ' + ui.value + '%');
            var above = 0;
            var below = 0;
            for (var count = 0; count < studentsData.length; count++) {
                if (parseFloat(studentsData[count].gpa) >= parseFloat(ui.value)) {
                    above++;
                } else {
                    below++;
                }
            }
            aboveXChart.data.labels = ['More than or equal to ' + ui.value + '%', 'Less than ' + ui.value + '%'];
            aboveXChart.data.datasets[0].data = [above, below];
            aboveXChart.update();
        }
    });
}

function sortNumber(a,b) {
    return a - b;
}