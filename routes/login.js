var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

router.get('/', function(req, res) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

module.exports = router;