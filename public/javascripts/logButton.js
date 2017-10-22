/*global $*/

$(function() {
    $.ajax({
        url: '/api/current-user',
        method: 'GET',
        success: function(response) { //Checks if the user is logged in or out
            if (response != '') {
                $('#log-in-out').text('Log Out');
                logInWithGoogle(true);
            } else {
                $('#log-in-out').text('Log In');
                logInWithGoogle(false);
            }
        }
    });
});

function logInWithGoogle(isLoggedIn) {
    $('#log-in-out').on('click', function() {
        if (isLoggedIn) {
            window.location.replace('/auth/logout');
        } else {
            window.location.replace('/login');
        }
    });
}