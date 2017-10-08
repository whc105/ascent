//Adds the student
function addStudent(db, res, student) {
    var collection = db.collection('students');
    checkID(student.id, collection)
    .then(function(result) {
        if (result.length == 0) {
            if (student.currentClasses.length == 1 && student.currentClasses[0] === '') {
                student.currentClasses = [];
            }
            if (student.pastClasses.length == 1 && student.pastClasses[0] === '') {
                student.pastClasses = [];
            }
            if (student.reportIDs.length == 1 && student.reportIDs[0] === '') {
                student.reportIDs = [];
            }
            if (student.gpa === '') {
                student.gpa = null;
            }
            if (student.cohort === '') {
                student.cohort = null;
            }
            collection.insert([student], function(err, result){
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

var checkID = function(ID, studentCollection) {
    return new Promise(function(resolve) {
        studentCollection.find({'id':ID}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                resolve(result);
            }
        });
    });
};

function totalAdd(db, res, newStudent) {
    return addStudent(db, res, newStudent);
}
module.exports = totalAdd;