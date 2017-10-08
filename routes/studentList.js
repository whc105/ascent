const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const csv = require('csvtojson');
const formidable = require('formidable');
const fs = require('fs-extra');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

var addStudent = require('../serverJS/addStudent.js');

var db;
MongoClient.connect(url, function(err, database) {
    if (err) {
        console.log('Fail to connect', err);
    }
    else {
        db = database;
    }
});

//Renders student list
router.get('/', function(req, res) {
    studentsToArray(db, res);
});

//CSV upload, post request to database
router.post('/', function(req, res) {
    if (req.originalUrl == '/studentList' && req.method.toLowerCase() == 'post') {
        parseCSVFile(req, res, db);
    }
});


router.post('/newStudent', function(req, res){
    console.log('Connected to Server');
    //creates a student object
    var gpa = req.body.gpa;
    if (gpa === '') {
        gpa = null;
    }
    var newStudent = {
        id: req.body.id, fName: req.body.fName, mName: req.body.mName, lName: req.body.lName,
        dob: req.body.dob, gender: req.body.gender,
        sped: req.body.sped, ell: req.body.ell, grade: req.body.grade,
        graduationYear: req.body.graduationYear, gpa: gpa, cohort: req.body.cohort,
        currentClasses: [], pastClasses: [],
        reportIDs: []
    };
    addStudent(db, res, newStudent);
    res.redirect('/studentList');
});


router.get('/removeStudent', function(req, res) {
    var collection = db.collection('students');
    collection.find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('removeStudent', {studentList: result});
        }
    });
});

router.post('/removeStudent', function(req, res){
    var studentID = req.body;
    checkIfExist(db, res, studentID);
});

//Creates a dynamic page for each student
router.get('/:id', function(req, res, next) {
    var studentID = req.params.id;
    findStudentData(db, res, studentID);
});

//Updates database with new student data
router.post('/:id', function (req, res) {
    var studentID = req.params.id;
    var updateStudent = { //Creates student object
        fName: req.body.fName, mName: req.body.mName, lName: req.body.lName,
        gender: req.body.gender, sped: req.body.sped, ell: req.body.ell, 
        grade: req.body.grade, cohort: req.body.cohort
    };
    updateStudentData (db, res, studentID, updateStudent); 
});

//Finds student
function findStudentData(db, res, studentID) {
    var collection = db.collection('students');
    collection.find({'id':studentID}).toArray(function(err, result) {
        if (err || result.length == 0) {
            console.log(err);
            res.redirect('../studentList');
        } else {
            var classCollection = db.collection('classes');
            getEnrolledClasses(classCollection, studentID)
            .then(function(enrolledClasses) {
                res.render('dynamicStudent', {name: result[0].fName + ' ' + result[0].lName, id: result[0].id,'studentData': result[0], enrolledClasses: enrolledClasses});
            });
        }
    });
}

//Finds all enrolled students
var getEnrolledClasses = function (classCollection, studentID) {
    return new Promise(function(resolve) {
        classCollection.find({'students':studentID}, {'_id':0, 'name':1}).toArray(function(err, result){
            if (err) {
                console.log(err);
            } else {
                resolve(result);
            }
        });
    });
};


//Updates student data with the new data from the form
function updateStudentData (db, res, studentID, update_student) {
    var collection = db.collection('students');
    collection.update({'id':studentID}, {$set : {
        'fName':update_student.fName, 'mName':update_student.mName, 'lName':update_student.lName,
        'gender':update_student.gender, 'sped':update_student.sped, 'ell':update_student.ell,
        'grade':update_student.grade, 'cohort':update_student.cohort
        }}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(studentID);
        }
    });
}


function parseCSVFile(req, res, db) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }
        else {
            const pathLocation = files.upload.path;
            csv()
            .fromFile(pathLocation)
            .on('json',(jsonObj)=> {
                addStudent(db, res, jsonObj);
            })
            .on('done',(error)=> {
                console.log('end');
            });
            res.redirect('studentList');
        }
    });
}

//Finds all the students and turns it into array
function studentsToArray(db, res) {
    var collection = db.collection('students');
    collection.find({}).toArray(function(err, result){
        if (err) {
            console.log(err);
        }
        else {
            res.render('studentList', {'studentList': result});
        }
    });
}

function checkIfExist(db, res, studentID) {
    studentID = Object.keys(studentID);
    for (var count = 0; count < Object.keys(studentID).length; count++) {
        console.log(studentID[count]);
        removeStudent(db, res, studentID[count]);
        removeFromClass(db, res, studentID[count]);
        removeFromAssignment(db, res, studentID[count]);
    }
    res.redirect('/studentList');
}

//remove student
function removeStudent (db, res, studentID) {
    var collection = db.collection('students');
    collection.remove({'id' : studentID}, function(err, result){
        if (err) {
           console.log(err);
        } 
    });
}

//remove student from class
function removeFromClass (db, res, studentID) {
    var classCollection = db.collection('classes');
    classCollection.updateMany({'students':studentID}, {$pull:{'students':studentID}}, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function removeFromAssignment (db, res, studentID) {
    var assignmentCollection = db.collection('assignments');
    assignmentCollection.updateMany({}, {$pull:{'students':{'id':studentID}}}, function(err) {
        if (err) {
            console.log(err);
        }
    });
}


module.exports = router;