const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

var db;

MongoClient.connect(url, function(err, database) {
        if (err) {
            console.log('Fail to connect', err);
        }
        else {
            db = database;
        }
});
//Rendering the page

router.get('/', function(req, res, next) {
    res.render('signUp');
});

router.post('/', function(req, res){
    console.log('Connected to Server');
    //create new account object
    var newAccount = {
        pemail: req.body.p-Email, schoolName: req.body.schoolName, 
        schoolAdr: req.body.schoolAdr, password: req.body.password
    };
    createAccount(db, res, newAccount);
});

function createAccount(db, res, newAccount) {
    const accountCollection = db.collection('userLogIns');
    accountCollection.insert([newAccount], function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Successful input');
            res.redirect('studentList');
        }
    });
}

module.exports = router;