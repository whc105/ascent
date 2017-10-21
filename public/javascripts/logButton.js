/*global $*/
$(function() {
    child();
    //if($(logInStatus).prop('name') === 'true') {
});
function child(){
    var logInStatus = false;
    $.ajax({
        url:'/isLoggedIn',
        method: 'GET',
        success: function(logInStatuss) {
            if(typeof logInStatuss != undefined && logInStatuss != "")
            {
                logInStatus = logInStatuss;
            }
        }
    })
    .done(function(data) {
        if(logInStatus == true){
            $('#LogInOut').prop('textContent',"Log Out");
            $('#LogInOut').on('click', function() {
                $.ajax({
                    url:'/logOut',
                    method: 'POST',
                    success: function(response) {
                        if ($('#LogInOut').text('Log Out')) {
                            alert("You Have Logged Out");
                        };
                        $('#LogInOut').attr('onClick', 'window.location.href= "./userLogIn"');
                        $('#LogInOut').prop('textContent',"Log In");
                    }
                });
            });
           // $('#LogInOut').attr('onClick', 'window.location.href= "./classStats"');
        } else{
            $('#LogInOut').attr('onClick', 'window.location.href= "./userLogIn"');
            $('#LogInOut').prop('textContent',"Log In");
        }
    })
    .fail(function() {
        console.log("There was an error");
    });
}