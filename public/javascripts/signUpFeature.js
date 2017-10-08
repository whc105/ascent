function checkValid(){
    
    //check passwords 
    var allValid = false;
    var password = document.getElementById("password");
    var password2 = document.getElementById("password2");
    
    if(password.value !== password2.value){
        var errorText = document.getElementById("errormsg");
        errorText.innerHTML = "* Passwords do not match";
        errorText.style.color = "red";
    }
    else if(password.value == "" || password2.value == ""){
        var errorText = document.getElementById("errormsg");
        errorText.innerHTML = "*One or more password text fields are empty";
        errorText.style.color = "red";
    }
}