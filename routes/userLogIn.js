const simpleTools = require('../public/javascripts/simpleTools.js');

var express = require('express');
var session = require('express-session');
var router = express.Router();
var mongodb = require('mongodb');
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

/* Session keys
userName
adminStatus
valid - true/false

*/
//Rendering the page

router.get('/', function(req, res) {
    if(req.session.valid)
    {
        res.send("You are logged in as " + req.session.userName + " your admin status is " + req.session.adminStatus);
    }else{
        res.render('userLogIn', {title: 'Log In'});
    }
});

//trying to get mongodb connection
router.post('/', function(req, res) {
    console.log("post called");
    //req.check('email', 'Invalid Email Address').isEmail();
    var userName = req.body.userName; //search term for username, this can be replaced with email in a time
    var password = req.body.password; //searching term for password
    //var adminStatus = simpleTools.checkBoxToTF(req.body.adminStatus);
    
    console.log("user name to : " + userName);

    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Fail to connect', err);
        }
        else {
            var logInInfo = { userName : userName, password : password};
            
            if(findLogIn(db, req, res, logInInfo))
            {
                console.log('Log In Correct, PLease Redirect');
                //res.render('dynamicStudent', {title: 'kack', 'studentData': 'nowt'});
            }
            else{
                //This apparently breaks it because you are sending multiple responses //How you logout tho
                //res.render('userLogIn', {title: 'Wrong Info'});
            }
        }
    });
    //res.redirect('http://reddit.com');
});

//finds account
function findLogIn(db, req, res, logInInfo) {
    var collection = db.collection('userLogIns');
    //var results = collection.find({'userName':logInInfo.userName});
    collection.find({'userName' : logInInfo.userName}).toArray(function(err, result){
        if(err){
            console.log('Something went wrong: ' + err);
        }else{
            if(typeof result != 'undefined' && typeof result[0] != 'undefined' && typeof result[0].password != 'undefined'){
                //req.session.valid = true; //session value to say if it is true
                
                if(logInInfo.password == result[0].password)
                {
                    console.log(result[0].userName +"   " + result[0].password + ":" + logInInfo.password);
                    console.log("Succesful login");
                    req.session.userName = result[0].userName;
                    req.session.adminStatus = result[0].adminStatus;
                    req.session.valid = true;
                    db.close();
                    res.redirect('/');
                    return true;
                }else{
                    console.log("Unsucessful login");
                    return false;
                }
            }
        }
        db.close();
    });
    return false;
}
    
//Database does not exist
//Database does exist
//db.createCollection("userLogIns, {autoIndexId : true}")
//db.userLogIns.insert({userName: 'Mirjan Neza', password : 'HelloWord'})



module.exports = router;