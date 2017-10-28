/*global $*/
function validate() {
    if ($('#password').val() === $('#verify-password').val()) {
        const userData = {email: $('#email').val(), password: $('#password').val(), schoolName: $('#school-name').val(), key: $('#key').val()};
        $.ajax({
            url: '/signUp',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (response) {
                if (response) {
                    window.location.href = '/';
                }
            }
        });
    } else {
        $('.password-box').css({
            'border':'2px solid red'
        });
    }
}