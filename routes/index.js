var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
    
});


router.get('/isLoggedIn', function(req, res, next){
    res.send(req.session.valid);
});

router.post('/logOut', function(req, res, next) {
    console.log("Log Out called");
    req.session.valid = false;
    res.send(true);
});

module.exports = router;