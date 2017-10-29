const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

router.get('/', function(req, res, next) {
    console.log("Render classStats");
    res.render('classStats');
});

module.exports = router;