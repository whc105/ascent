/*global $*/

$(function() {
    $.ajax({
        url: '/api/current-user',
        method: 'GET',
        success: function(response) { //Checks if the user is logged in or out
            if (response != '') {
                $('#log-in-out-google').text('Log Out Of Google')
                logInWithGoogle(true);
            } else {
                $('#log-in-out-google').text('Log In With Google')
                logInWithGoogle(false);
            }
        }
    });
});

function logInWithGoogle(isLoggedIn) {
    $('#log-in-out-google').on('click', function() {
        if (isLoggedIn) {
            window.location.replace('https://ascent-db-alt-althe.c9users.io/auth/logout')
        } else {
            window.location.replace('http://ascent-db-alt-althe.c9users.io:8080/auth/google')
        }
    });
}