/*global $*/
$(function() {
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
});