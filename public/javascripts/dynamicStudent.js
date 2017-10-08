/*global $*/

//This changes the visibility of dynamic student page to show the form when switch is pressed
$(function() {
    updateVisibility();
    changeLetters();
});

function updateVisibility() {
    $('[name="updateSwitch"]').bootstrapSwitch();
    $('input[name="updateSwitch"]').on('switchChange.bootstrapSwitch', function(event, state) {
        if (state) {
            $('#studentDataList').css({
                'display':'none'
            });
            $('#updateForm').css({
                'display':'inline-block'
            });
        }
        else {
            $('#studentDataList').css({
                'display':'inline-block'
            });
            $('#updateForm').css({
                'display':'none'
            });
        }
    });
}

function changeLetters() {
    if ($('#sped').text() === 'y') {
        $('#sped').text('Yes');
    } else {
        $('#sped').text('No');
    }
    
    if ($('#ell').text() === 'y') {
        $('#ell').text('Yes');
    } else {
        $('#ell').text('No');
    }
}