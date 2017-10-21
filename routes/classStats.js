const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/config.js').keys;
const url = keys.mongoURI;
var statistics = require('./statistics');

var totalCount = 0; //Total number of students
var totalGrade = 0; //total grade
var genderCount = [0,0,0]; // [male, female, (boy girl hybrid)]
var genderGrade = [0,0,0]; // the grades for ^
var spedCount = [0,0]; //[Not special, special eduction]
var spedGrade = [0,0];
var ellCount = [0,0]; //[Not ell, yes ell]
var ellGrade = [0,0];
//Should do combo stats as well

router.get('/', function(req, res, next) {
    console.log("Render classStats");
    res.render('classStats');
});

//Ajax router call to get the list of classes for dropdown menu
router.get('/classNameList', function(req, res) {
    console.log("get /classNameList");
    MongoClient.connect(url)
        .then(function (db) { // <- db as first argument
            console.log("Connectd to mongoclient at /classNameList");
            getClassNames(db)
                .then(function(result)
                {
                    //console.log("The result was " + result);
                    res.send(result);
                });
                /* This causes an error, i have no idea why
                .cath(function(err)
                {
                    if(err)
                    {
                        console.error(err);
                    }
                });*/
        })
        .catch(function(err){
            if(err){
                console.error(err);
                console.error("Failed to mongoclient at /classNameList");
            }
        });
});


function getClassNames(db){
    return new Promise((resolve, reject) =>{
        var collection = db.collection('classes');
        collection.find().toArray()
            .then(function(result){
                var classNames = [];
                if(result != undefined)
                {
                    result.forEach(function(classInfo, index){
                        //console.log("class info : " + classInfo.name);
                        if(classInfo != undefined && classInfo.name != null && classInfo.name != "")
                        {
                            classNames.push(classInfo.name);
                        }
                    });
                    resolve(classNames);
                }
            })
            .catch(function(err){
                if(err)
                {
                    console.err("Failed to find at getClassNames");
                    reject("In getClassNames collection.find promise " + err);
                }
            });
    });
    
}

router.post('/calculateStats', function(req, res, next){
    console.log(req.body.className);
    var className = req.body.className;
    MongoClient.connect(url)
        .then(function (db) { // <- db as first argument
            console.log("Connectd to mongoclient at /getStats");
            getClassStudentIDs(db, className)
                .then(function(students)
                {
                    console.log(students);
                    getClassGrades(db, className, students)
                        .then(function(accept)
                        {
                            console.log("result is : " + accept);
                            var returnTable = [totalCount, totalGrade, genderCount, genderGrade, spedCount, spedGrade, ellCount, ellGrade];
                            res.status(200).send(returnTable);
                        })
                        .catch(function(err)
                        {
                           if(err)
                           {
                               console.log(err);
                           }
                        });
                })
                .catch(function(err){
                    if(err)
                    {
                        console.log("Error in return from getClassStudentIDs " + err);
                    }
                });
        })
        .catch(function(err){
            if(err){
                console.error(err);
                console.error("Failed to mongoclient at /getStats");
            }
        });
});
function getClassStudentIDs(db, className)
{
    return new Promise((accept,reject)=>{
        var collection = db.collection('classes');
        collection.find({name : className}).toArray()
            .then(function(result){
                if(result != undefined)
                {
                    if(result[0].students.length > 0)
                    {
                        accept(result[0].students);
                    }else{
                        reject("No sudents in class");
                    }
                }
            })
            .catch(function(err){
                if(err)
                {
                    console.log("Eror in getClassStudentIDs " + err);
                    reject(err);
                }
            });
    });
}

function getClassGrades(db, className, studentIDs)
{
    console.log("INSSIDE FIND STUDENTS");
    console.log(studentIDs);
    totalCount = 0; //Total number of students
    totalGrade = 0; //total grade
    genderCount = [0,0,0]; // [male, female, (boy girl hybrid)]
    genderGrade = [0,0,0]; // the grades for ^
    spedCount = [0,0]; //[Not special, special eduction]
    spedGrade = [0,0];
    ellCount = [0,0]; //[Not ell, yes ell]
    ellGrade = [0,0];
    //yearSpread = [0,0,0,0]; //5,6,7,8 grade count
    //yearGrade = [0,0,0,0];
    
    //get the list of assignments
    var collection = db.collection('students');
    return new Promise((accept, reject)=>{
    if(studentIDs != undefined){
        collection.find({id : {$in : studentIDs}}).toArray(function(err, studentInfo){
            //studentINfo will be an ID, and then that students information
            console.log('Found the students refrenced by the ids');
            var studentGrades = []; // [studentID, totalGrade, number of grades]
            studentInfo.forEach(function(student,index)
            {
                //console.log(student.id);
                studentGrades.push([student.id, 0, 0]);
            });
            getAssignments(db, className)
                .then(function(assignmentScoring) //so now we have a list of students, so foreach assignmentScoring, do foreach assignmentScoring.studen
                {
                    //each assignment, which will contain students
                    assignmentScoring.forEach(function(assignment, index){
                        //list of students and there scores
                        //console.log(assignment.students);
                        assignment.students.forEach(function(studentGrade, index)
                        {
                            //id, and grade for a individual student
                            //console.log(studentGrade.id);
                            studentGrades.forEach(function(values, index){
                               //values : [ID, totalGrade, number of grades
                               if(values[0] == studentGrade.id)
                               {
                                   //the student ids match, add the grade if not -1 and increment total count
                                   if(studentGrade.grades >= 0)
                                   {
                                       values[1] += studentGrade.grades;
                                       values[2] ++;
                                   }
                               }
                            });
                            //console.log(studentIDs[index] + " : " + studentGrade.id);
                        });
                        //console.log(studentGrades);
                    });
                    if(studentInfo != null)
                    {
                        //console.log(studentInfo);
                        //Go through each now student, and give the given grade to each student type catagory
                        studentInfo.forEach(function(studentInfo, index){
                            var studentGrade = studentGrades[index][1]/studentGrades[index][2];
                            totalCount += 1;
                            totalGrade += studentGrade
                            switch(studentInfo.gender){
                                case("M") : // student is a male
                                    genderCount[0] += 1; 
                                    genderGrade[0] +=studentGrade;
                                    break;
                                case("F") : // student is a female REEEEEEeee
                                    genderCount[1] += 1;
                                    genderGrade[1] +=studentGrade;
                                    break;
                                case('U') : //student is not gender binary
                                    genderCount[2] += 1;
                                    genderGrade[2] +=studentGrade;
                                    break;
                                default : 
                                    genderCount[0] += 1;
                                    genderCount[0] +=studentGrade;
                                    break;
                            }
                            switch (studentInfo.sped) {
                                case ('n') : //student is not special educatio
                                    spedCount[0] += 1;
                                    spedGrade[0] +=studentGrade;
                                    break;
                                case('y') : //student is a special edication
                                    spedCount[1] += 1;
                                    spedGrade[1] +=studentGrade;
                                    break;
                                default:
                                    spedCount[0] += 1;
                                    spedGrade[0] +=studentGrade;
                                    break;
                            }
                            switch (studentInfo.ell){
                                case('n') : // student speaks english
                                    ellCount[0] += 1;
                                    ellGrade[0] +=studentGrade;
                                    break;
                                case('y') : //Student is an ell
                                    ellCount[1] += 1;
                                    ellGrade[1] +=studentGrade;
                                    break;
                                default : 
                                    ellCount[0] += 1;
                                    ellGrade[0] +=studentGrade;
                                    break;
                            }
                        });
                    }
                    //generate total grade counts into averages
                    totalGrade = totalGrade / totalCount;
                    for(var x = 0; x < 3; x++)
                    {
                        genderGrade[x] = (genderGrade[x]/genderCount[x]);
                    }
                    for(x = 0; x < 2; x++)
                    {
                        spedGrade[x] = (spedGrade[x]/spedCount[x]);
                        ellGrade[x] = (ellGrade[x]/spedCount[x]);
                    }
                    console.log('Should be at the end');
                    console.log(genderGrade[0] + " : " + genderGrade[1]);
                    //Now average grades per group has been generated, time to save it so it can be gathered by other ajax calls
                    accept(true);
                })
                .catch(function(err)
                {
                    if(err)
                    {
                        console.log(err);
                        reject(err);
                    }
                });
            if(err)
            {
                console.log(err + 'Error in student find for classStats');
                reject(err);
            }
        });
    }
    });
}

function getAssignments(db, className)
{
    return new Promise((accept, reject)=>{
        var collection = db.collection('assignments');
        collection.find({className : className}, {students : 1}).toArray()
            .then(function(assignmentScoring)
            {
                //console.log("Assignment Socring");
                //console.log(assignmentScoring[0]);
                accept(assignmentScoring);
            })
            .catch(function(err){
                if(err)
                {
                    console.log(err);
                    reject(err);
                }
            });
            
    });
}

function calculateGrade(scoring)
{
    var grade = 0;
    scoring.forEach(function(gradeObject, index)
    {
        if(gradeObject != null){
            if(gradeObject.categoryScore != null)
            {
                if(isInt(gradeObject.categoryScore.score))
                {
                    grade += gradeObject.categoryScore.score;
                }
            }
        }
    });
    return grade;
}

function dataSetGenerator(studentInfo, studentGrades)
{
    
}

//some nice stolen code right here from https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}
module.exports = router;