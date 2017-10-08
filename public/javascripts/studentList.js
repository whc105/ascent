/*global $*/
/*global students*/

var studentElements;
$(document).ready(function() {
    studentElements = [...$('.student_list_item')];
});

function changeColors(gpa, studentID) {
    if(gpa >= 90) //A Grade
    {
        $('.'+studentID).children().children('.progress-bar').css({
            'background': 'rgba(0, 141, 255, 0.85)'
        });
        return;
    }else if(gpa >= 80) //B Grade
    {
        $('.'+studentID).children().children('.progress-bar').css({
            'background': 'rgba(0, 210, 0, 0.8)'
        });
        return;
    }else if(gpa >= 70) //C Grade
    {
        $('.'+studentID).children().children('.progress-bar').css({
            'background': 'rgba(239, 167, 66, 0.95)'
        });
        return;
    }else if(gpa >= 60) //D Grade
    {
        $('.'+studentID).children().children('.progress-bar').css({
            'background': 'rgba(255, 0, 0, 0.9)'
        });
        return;
    }else //F Grade
    {
        $('.'+studentID).children().children('.progress-bar').css({
            'background': 'rgba(142, 18, 42, 0.95)'
        });
        return;
    }
}

//Key up search
function search() {
    $('#searchInput').on('keyup', function() {
        var query = $('#searchInput').val().toLowerCase().trim();
        //Finds all the non-matching students
        var hiddenStudentIDs = students.filter(function(student) {
            var fullName = student.fName.toLowerCase() + ' ' + student.lName.toLowerCase();
            return !(fullName.includes(query));
        }).map(function(student) {
            return student.id;
        });
        
        //Add or remove students from the list
        studentElements.forEach(function(elem) {
            if (hiddenStudentIDs.includes(elem.id)){
                elem.classList.add('hidden');
            } else {
                elem.classList.remove('hidden');
            }
        });
        
        //Shows or hides 'student not found'
        if (studentElements.length == hiddenStudentIDs.length) {
            $('#notFoundResult').show();
            $('#notFoundResult').text('No Students Found!').css({
                'color':'red',
                'font-size': '75%',
                'padding-top': '5px'
            });
        }
        else {
            $('#notFoundResult').hide();
        }
    });
}

//Filters
function mGenderFilter() {
    var mID = [];
    for (var count = 0; count < students.length; count++) {
        if (students[count].gender === 'M') {
            mID.push(students[count].id);
        }
    }
    return mID;
}

function fGenderFilter() {
    var fID = [];
    for (var count = 0; count < students.length; count++) {
        if (students[count].gender === 'F') {
            fID.push(students[count].id);
        }
    }
    return fID;
}

function spedFilter() {
    var spedID = [];
    for (var count = 0; count < students.length; count++) {
        if (students[count].sped === 'y') {
            spedID.push(students[count].id);
        }
    }
    return spedID;
}

function ellFilter() {
    var ellID = [];
    for (var count = 0; count < students.length; count++) {
        if (students[count].ell === 'y') {
            ellID.push(students[count].id);
        }
    }
    return ellID;
}

function switchFilter() {
    $('#filter-male').bootstrapSwitch('size','mini');
    $('#filter-fmale').bootstrapSwitch('size','mini');
    $('#filter-sped').bootstrapSwitch('size','mini');
    $('#filter-ell').bootstrapSwitch('size','mini');
    
    var studentID = [];
    for (var count = 0; count < students.length; count++) {
        studentID.push(students[count].id);
    }
    studentID = studentID.sort(sortNumber);
    
    var maleID = mGenderFilter();
    var femaleID = fGenderFilter();
    var spedID = spedFilter();
    var ellID = ellFilter();
    
    $('#filter-button').on('click', function(event) { //Filters students by specifications
        var filterID = studentID;
        if ($('#filter-male').bootstrapSwitch('state') == true) {
            filterID = filterID.filter(function(ID, index) {
                if (maleID.includes(filterID[index])) {
                    return ID;
                }
            });
        }
        if ($('#filter-fmale').bootstrapSwitch('state') == true) {
            filterID = filterID.filter(function(ID, index) {
                if (femaleID.includes(filterID[index])) {
                    return ID;
                }
            });
        }
        if ($('#filter-sped').bootstrapSwitch('state') == true) {
            filterID = filterID.filter(function(ID, index) {
                if (spedID.includes(filterID[index])) {
                    return ID;
                }
            });
        }
        if ($('#filter-ell').bootstrapSwitch('state') == true) {
            filterID = filterID.filter(function(ID, index) {
                if (ellID.includes(filterID[index])) {
                    return ID;
                }
            });
        }
        studentElements.forEach(function(student) {
            if (!(filterID.includes(student.id))) {
                student.classList.add('hidden');
            } else {
                student.classList.remove('hidden');
            }
        });
    });
}

//Disables page/enable add student subpage
function addStudentCover() {
    $('#add-student').click(function() {
        $('body').css({
            'overflow': 'hidden'
        });
        $('.fade-add').css({
            'display': 'block',
            'background': 'rgba(192,192,192,.7)',
            'z-index': '10',
            'position': 'fixed'
        });
    });
    $('#close-fade-add').click(function() {
        $('body').css({
            'overflow': 'auto'
        });
        $('.fade-add').css({
            'display': 'none',
            'opacity': '1',
            'background-color': 'rgba(0,0,0,0)',
            'z-index': '0',
            'position': 'relative'
        });
    });
}

//Disables page/enable remove student subpage
function removeStudentCover() {
    $('#remove-student').click(function() {
        $('body').css({
            'overflow': 'hidden'
        });
        $('.fade-remove').css({
            'display': 'block',
            'background': 'rgba(192,192,192,.7)',
            'z-index': '10',
            'position': 'fixed'
        });
    });
    $('#close-fade-remove').click(function() {
        $('body').css({
            'overflow': 'auto'
        });
        $('.fade-remove').css({
            'display': 'none',
            'opacity': '1',
            'background-color': 'rgba(0,0,0,0)',
            'z-index': '0',
            'position': 'relative'
        });
    });
}



function checkIDValid() {
    var sortedIDList = [];
    for (var idObject of students) {
        sortedIDList.push(idObject.id);
    }
    sortedIDList.sort(sortNumber);
    $('#input_id').on('blur', function() {
        var inputID = $('#input_id').val();
        if (sortedIDList.includes(inputID) || inputID === '') {
            $('.id-check').hide();
            $('.id-x').show();
            $('#submit_student').prop('disabled', true);
            $('#submit_student').text('Check User ID');
            $('#submit_student').css('cursor', 'not-allowed');
        }
        else {
            $('.id-x').hide();
            $('.id-check').show();
            $('#submit_student').prop('disabled', false);
            $('#submit_student').text('Submit');
            $('#submit_student').css('cursor', 'pointer');
        }
    });
}

function selectAllToRemove() {
    var ifChecked = false;
    $('#select-all-button').on('click', function() {
        if (ifChecked) {
            $('.input_id').prop('checked', false);
            $('#select-all-button').text('Select All');
            $('#select-all-button').toggleClass('bttn-primary');
            $('#select-all-button').toggleClass('bttn-danger');
            ifChecked = false;
        } else {
            $('.input_id').prop('checked', true);
            $('#select-all-button').text('Deselect All');
            $('#select-all-button').toggleClass('bttn-primary');
            $('#select-all-button').toggleClass('bttn-danger');
            ifChecked = true;
        }
    });
}

$(function() {
    $('.student_list_item').click(function() { //Makes student boxes clickable
        window.location = $(this).children('a').attr('href');
    });
    $('#open').click(function() {
        if ($('.filter-tool').is(":visible")) {
            $('.filter-tool').hide();
        } else {
            $('.filter-tool').show();
        }
    });
    search(); //Search Function
    switchFilter(); //Filter Function
    addStudentCover();
    removeStudentCover();
    selectAllToRemove();
    checkIDValid();
});


function sortNumber(a,b) {
    return a - b;
}