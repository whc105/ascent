var express = require('express');
var session = require('express-session');
var router = express.Router();

    
//session handler code
router.get('/', function(req, res){
    console.log("I am here");
    console.log("Session user Name = " + req.session.userName);
    if(!req.session.userName)
    {
        return res.status(401).send();
    }
    res.render('examplePage.jade');
    console.log("Session values are: userName: " + req.session.userName + " adminStatus: " + req.session.adminStatus + " is Valid: " + req.session.valid);
});


module.exports = router;