//File for simple tools, anything less than 10 lines of code that serves
//very little function
//Converts the On/Off 
exports.checkBoxToTF = function(checkBox)
{
    if(checkBox == "on")
    {
        return true;
    }else{
        return false;
    }
}

exports.isLoggedIn = function(req)
{
    if(req.session.valid)
    {
        return true;
    }
    return false;
}

exports.returnUserName = function(req)
{
    return req.session.userName;
}