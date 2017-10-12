const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

var db;

MongoClient.connect(url, function(err, database) {
    if (err) {
        console.log(err);
    }
    else {
        db = database;   
    }
});

router.get('/', function(req, res, next) {
    res.render('rubrics');
});

router.get('/rubricCreator', function(req, res, next) {
    res.render('rubricCreator');
});

//Render delete rubric 
router.get('/removeRubric', function(req, res, next) {
    res.render('removeRubric');
});

//Get rubric JSON structure
router.post('/getRubricJSON', function(req, res, next) {
    var searchData = req.body.rubricName.toLowerCase();
    console.log('Sucessful connection');
    var rubrics = db.collection('rubrics');
    rubrics.find().toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var rubricList = [];
            for (var count = 0; count < result.length; count++) {
                if (result[count].rubricName.toLowerCase() === searchData) {
                    rubricList.push(result[count]);
                }
            }
            res.send(rubricList);
        }
    });
});

//submitting the rubric function 
router.post('/rubricCreator', function(req, res){
    var rubricCollection = db.collection('rubrics');
    var finalRubric = req.body;
    rubricCollection.find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var uniqueID = 0;
            if (result.length != 0) {
                uniqueID = result[result.length - 1].id + 1;
            }
            finalRubric.id = uniqueID;
            rubricCollection.insert(finalRubric, {ordered: false}, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send({redirect: '/rubrics'});
                }
            });
        }
    });
});

//Grades students
router.post('/gradeStudent', function(req, res) {
    var assignmentCollection = db.collection('assignments');
    
    console.log(req.body);
    
    var assignmentName = req.body.assignmentName;
    var studentID = req.body.id;
    var grades = req.body.grades;
    var overallComments = req.body.overAllComments;
    var topicList = req.body.topicList;
    var topicGrades = req.body.topicGrades;
    var allComments = req.body.allComments;
    
    var scoring = [];
    for (var count = 0; count < topicGrades.length; count++) {
        scoring.push({topic: topicList[count], score: topicGrades[count], comments: allComments[count]});
    }
    
    //Updates the grade with their data
    assignmentCollection.update({'assignmentName':assignmentName, 'students':{$elemMatch:{'id':studentID}}},
    {$set:{'students.$.overAllComments':overallComments, 'students.$.grades':grades, 'students.$.scoring':scoring}}, function(err) {
        if (err) {
            console.log(err);
            res.send({resultString:'ERROR, NOT SAVED'});
        } else {
            res.send({resultString:'Grade is saved'});
        }
    });
});

//Gets students grades
router.post('/getGrades', function(req, res) {
    var assignmentCollection = db.collection('assignments');
    var classes = db.collection('classes');
    var assignmentName = req.body.assignmentName;
    var className = req.body.className;
    getClassID(className, classes)
    .then(function(classID) {
        assignmentCollection.find({'classID':classID, 'assignmentName':assignmentName}, {'_id':0, 'students':1}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({studentData: result[0].students});
            }
        });
    });
});

//Get classID
var getClassID = function (className, classesCollection) {
    var classID;
    return new Promise(function(resolve) {
        classesCollection.find({'name':className}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                classID = result[0].id;
                resolve(classID);
            }
        });
    });
};

module.exports = router;