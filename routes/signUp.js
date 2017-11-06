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
    var permissionLevel = -1;
    if (req.body.key === 'hSkfgruIB0') {
        permissionLevel = 3;
    } else if (req.body.key === 'wP0zshIQNL') {
        permissionLevel = 2;
    } else if (req.body.key === '34XeKOgOa6') {
        permissionLevel = 1;
    } else if (req.body.key === 'SfnlaTKH2J') {
        permissionLevel = 0;
    } else {
        res.send('The key you submitted is wrong');
        return;
    }
    var newAccount = {email: req.body.email, password: req.body.password, schoolName: req.body.schoolName, permissionLevel: permissionLevel};
    createAccount(res, newAccount);
});

function createAccount(res, accountData) {
    const accountCollection = db.collection('users');
    var newAccount = accountData;
    newAccount.loggedDates = [];
    accountCollection.find().sort({id:-1}).limit(1).toArray(function(err, result) { //Sorts and get the highest ID level
        if (err) {
            console.log(err);
        } else {
            newAccount.id = result.length === 0 ? 0 : result[0].id + 1;
            accountCollection.insertOne(newAccount, function(err) {
                if (err) {
                    console.log(err); 
                    res.send(false);
                } else {
                    res.send(true);
                }
            });
        }
    });
}

module.exports = router;