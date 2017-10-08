/*global $*/
/*global studentList*/
$(function() {
    for (var count = 0; count < Math.floor(studentList.length/10); count++) {
        $('#studentTabs ul').append("<li id=linkTab><a href='#tab-" + count + "'>" + parseInt(count + 1) + "</a></li>");
        $('#studentTabs').append("<div id='tab-" + count + "'</div>");
        for (var studentCount = count*10; studentCount < (count+1)*10; studentCount++) {
            $('#studentTabs #tab-' + count).append((studentCount+1) + '. ' + studentList[studentCount].fName + ' ' + studentList[studentCount].lName + '<br>');
        }
    }
    if (studentList.length % 10 != 0) {
        var lastTab = Math.floor(studentList.length/10) + 1;
        $('#studentTabs ul').append("<li id=linkTab><a href='#tab-" + lastTab + "'>" + lastTab + "</a></li>");
        $('#studentTabs').append("<div id='tab-" + lastTab + "'</div>");
        for (var studentCount = (lastTab - 1)*10; studentCount < studentList.length; studentCount++) {
            $('#studentTabs #tab-' + lastTab).append((studentCount+1) + '. ' + studentList[studentCount].fName + ' ' + studentList[studentCount].lName + '<br>');
        }
        $('#studentTabs').tabs();
    }
    if (studentList.length == 0) {
        $('#studentTabs').append('<br><br><br><br><h3> No Students Found</h3>')
    }
});