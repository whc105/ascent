const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;


router.get("/", function(req, res)
{
   res.render("faculty"); 
});

router.get("/newFaculty", function(req, res)
{
   res.render("newFaculty"); 
});

module.exports = router;