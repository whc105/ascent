//THIS ROUTE FILE IS FOR INTERNAL TESTING ONLY
//URLs SHOULD NOT BE LINKED ANYWHERE
//k ty bye

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('rubric-creator-INTERNAL-TESTING');
});

module.exports = router;