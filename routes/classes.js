const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;

var db;
const getClassData = require('../libraries/getClassData.js');
var addAssignment = require('../serverJS/addAssignment.js');

MongoClient.connect(url, function(err, database) {
    if (err) {
        console.log(err);
    } else {
        db = database;
    }
});

//Renders classes page
router.get('/', function(req, res, next) {
    var classes = db.collection('classes');
    classes.find({},{'_id':0}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('classes', {'classesList':result});
        }
    });
});

//For later use after teachers are done
router.post('/newClass/findTeacher', function(req, red) {
});

//Renders all the data for the individual class
router.get('/:className', function(req, res, next) {
    var className = req.params.className;
    var classes = db.collection('classes');
    var assignments = db.collection('assignments');
    var students = db.collection('students');
    getClassData.getClassID(className, db)
    .then(function(classID) {
        if (!(classID instanceof Error)) {
            classes.find({'id':classID}).toArray(function(err, classesResult) {
                if (err) {
                    console.log(err);
                } else {
                    assignments.find({'classID':classID}, {'_id':0, 'assignmentName':1}).toArray(function(err, assignmentsResult) {
                        if (err) {
                            console.log(err);
                        } else {
                            students.find({'currentClasses':classID}).toArray(function(err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.render('dynamicClasses', {classname:classesResult[0].name, subject:classesResult[0].subject, studentList:result, assignments:assignmentsResult});
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.redirect('../classes');
        }
    });
});

//New Assignment
router.get('/:className/newAssignment', function(req, res, next) {
   res.render('newAssignment', {classID: req.params.className});
});

//Updates DB with new assignment
router.post('/:className/newAssignment', function(req, res) {
    var newAssignments = req.body;
    var className = req.params.className;
    getClassData.getClassID(className, db)
    .then(function(classID) {
        addAssignment(db, res, newAssignments, className, classID);
    });
    res.redirect('/classes/' + className);
});

//Renders Removes Assignment Page
router.get('/:className/removeAssignment', function(req, res) {
    res.render('removeAssignment', {classID: req.params.className});
});

//Removes assignment from class and from the assignment collection
router.post('/:className/removeAssignment', function (req, res) {
    var removeAssignmentName = req.body.name; //Takes the data from the form
    var className = req.params.className;
    removeAssignment(db, res, removeAssignmentName, className);
    res.redirect('/classes/' + className);
});

//Gets all students that are not in the class
router.get('/:className/addStudents', function(req, res) {
    var className = req.params.className;
    getAllNotInClassStudents(db, res, className);
});

//Adds all the students from the addStudents page into the class
router.post('/:className/addStudents', function(req, res) {
    var className = req.params.className;
    getClassData.getClassID(className, db)
    .then(function(classID) {
        addStudentsToClass(db, res, classID, req.body);
        res.redirect('/classes/' + className);
    });
});

//Gets all students that are in the class
router.get('/:className/removeStudents', function(req, res) {
    var className = req.params.className;
    getAllInClassStudents(db, res, className);
});

//Adds all the students from the addStudents page into the class
router.post('/:className/removeStudents', function(req, res) {
    var className = req.params.className;
    removeStudentsFromClass(db, res, className, req.body);
    res.redirect('/classes/' + className);
});

//Gets the dynamic page
router.get('/:className/:assessment', function(req, res, next) {
    var className = req.params.className;
    var assignmentName = req.params.assessment;
    findStudentAssessments(db, res, assignmentName, className);
});

function findStudentAssessments(db, res, assignmentName, className) {
    //Finds the all the students with the given assignment
    var assignmentCollection = db.collection('assignments');
    var students = db.collection('students');
    var rubrics = db.collection('rubrics');
    getClassData.getClassID(className, db)
    .then(function(classID) {
        students.find({'currentClasses':classID}, {'_id':0}).toArray(function(err, studentResult) {
            if (err || studentResult.length == 0) {
                console.log(err);
                res.redirect('../' + className);
            } else {
                assignmentCollection.find({'assignmentName':assignmentName, 'classID':classID},{'_id':0}).toArray(function(err, assignmentResult) {
                    if (err || assignmentResult.length == 0) {
                        console.log(err);
                        res.redirect('../' + className);
                    } else {
                        rubrics.find({'id':assignmentResult[0].rubricID}).toArray(function(err, rubricResult) {
                            if (err || rubricResult.length == 0) {
                                console.log(err);
                                res.redirect('../' + className);
                            } else {
                                
                                res.render('assessment', {
                                    rubricName: rubricResult[0].rubricName, 
                                    rubric: rubricResult[0], 
                                    className: className, 
                                    assignmentName: assignmentResult[0].assignmentName, 
                                    date: assignmentResult[0].date, 
                                    assignmentData: assignmentResult[0].students.sort(sortNumber),
                                    studentList: studentResult.sort(sortNumber)
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

function sortNumber(a, b) {
    return a.id - b.id;
}

//Add students to class
function addStudentsToClass(db, res, classID, inputData) {
    var students = db.collection('students');
    var classes = db.collection('classes');
    var studentIDs = Object.keys(inputData);
    for (var count = 0; count < studentIDs.length; count++) {
        students.update({'id':studentIDs[count]}, {$push:{'currentClasses':classID}}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    classes.update({'id':classID}, {$push:{'students':{$each:studentIDs}}}, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

//Remove students from class
function removeStudentsFromClass(db, res, className, inputData) {
    var students = db.collection('students');
    var classes = db.collection('classes');
    var studentIDs = Object.keys(inputData);
    getClassData.getClassID(className, db)
    .then(function(classID) {
        for (var count = 0; count < studentIDs.length; count++) {
            students.update({'id':studentIDs[count]}, {$pull:{'currentClasses':classID}}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            classes.update({'id':classID}, {$pull:{'students':studentIDs[count]}}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

//Get all the students that are not in the class
function getAllNotInClassStudents(db, res, className) {
    var students = db.collection('students');
    getClassData.getClassID(className, db)
    .then(function(classID) {
        students.find({'currentClasses':{$ne:classID}}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('addStudents', {className:className, availableStudents: result});
            }
        });
    });
}

//Get all the students that are not in the class
function getAllInClassStudents(db, res, className) {
    var students = db.collection('students');
    getClassData.getClassID(className, db)
    .then(function(classID) {
        students.find({'currentClasses':{$eq:classID}}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('removeStudents', {className:className, availableStudents: result});
            }
        });
    });
}

//Remove specified assignment name
function removeAssignment (db, res, assignmentName, className) {
    var assignmentCollection = db.collection('assignments');
    var classes = db.collection('classes');
    getClassData.getClassID(className, db)
    .then(function(classID) {
        getAssignmentID(assignmentName, classID, assignmentCollection)
        .then(function(assignmentID) {
            assignmentCollection.remove({'id': assignmentID}, function(err){
                if (err) {
                    console.log(err);
                }
            });
            classes.update({'id':classID}, {$pull:{'assignments':assignmentID}}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
}

var getAssignmentID = function (assignmentName, classID, assignmentCollection) {
    var assignmentID;
    return new Promise(function(resolve) {
        assignmentCollection.find({'assignmentName':assignmentName, 'classID':classID}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                assignmentID = result[0].id;
                resolve(assignmentID);
            }
        });
    });
};

module.exports = router;