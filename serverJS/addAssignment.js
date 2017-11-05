var rubricID;

//Gets all the students in class
var getStudentsInClass = function (db, res, classID) {
    var classes = db.collection('classes');
    return new Promise(function(resolve) {
        classes.find({'id':classID}, {'_id':0, 'students':1, 'id': 1}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                var studentList = result[0].students;
                resolve(studentList);
            }
        })
    });
};

var getRubric = function (db, res, rubricName, assignment, classID, studentList) {
    var rubricsCollection = db.collection('rubrics');
    return new Promise(function(resolve) {
        rubricsCollection.find({'rubricName':rubricName}, {'_id':0}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                rubricID = result[0].id;
                var studentGrade = [];
                //Takes the rubric and parses it to a section structure
                var rubricGradeStructure = [];
                var rubric = result[0];
                for (var count = 0; count < rubric.rubric.length; count++) {
                    var sectionStructure = {
                        topic: rubric.rubric[count].topic,
                        score: NaN,
                        comments: []
                    };
                    //Adds the section to the total rubric structure
                    rubricGradeStructure.push(sectionStructure);
                }
                for (var count = 0; count < studentList.length; count++) {
                    //Makes student grade structure
                    var gradeOBJ = {
                        id: studentList[count],
                        grades: -1,
                        overAllComments: '',
                        scoring: rubricGradeStructure
                    };
                    //Passes it to the student grade array
                    studentGrade.push(gradeOBJ);
                }
                resolve(studentGrade);
            }
        })
    });
}

//Add new assignments to the list of all assignments collection with grades
var addAssignmentGrading = function (db, res, assignment, classID, studentGrade) {
    var assignmentCollection = db.collection('assignments');
    return new Promise(function(resolve, reject) {
        assignmentCollection.find({}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                var uniqueID = 0;
                if (result.length != 0) {
                    uniqueID = result[result.length - 1].id + 1;
                }
                var assignmentID = uniqueID;
                assignmentCollection.insert({
                    'assignmentName' : assignment.AssignmentName, 'id': assignmentID,
                    'rubricID': rubricID, 'classID': classID,
                    'date': assignment.date, 'students': studentGrade, 'avg':null
                },{ordered: false}, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        studentGrade = [];
                        resolve(assignmentID);
                    }
                });
            }
        });
    });
};
                
//Adds assignment to class
function addAssignmentToClass(db, res, classID, assignmentID) {
    var classesCollection = db.collection('classes');
    classesCollection.update({'id':classID}, {$push:{'assignments':assignmentID}}, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function addAssignment (db, res, assignment, className, classID) {
    return getStudentsInClass(db, res, classID)
    .then(function(studentList) {
        return getRubric(db, res, assignment.RubricName, assignment, classID, studentList)
        .then(function(studentGrade) {
            return addAssignmentGrading(db, res, assignment, classID, studentGrade)
            .then(function(assignmentID) {
                return addAssignmentToClass(db, res, classID, assignmentID);
            });
        });
    });
}

module.exports = addAssignment;