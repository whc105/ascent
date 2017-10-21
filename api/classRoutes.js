const ObjectID = require('mongodb').ObjectID;

module.exports = app => {
    app.get('/api/classes', (req, res) => { //Finds all classes
        const db = req.app.locals.db;
        db.collection('classes').find().toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.get('/api/classes/:id', (req, res) => { //Finds all classes with the given ID
        const db = req.app.locals.db;
        const id = parseInt(req.params.id);
        db.collection('classes').find({ id }).toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.get('/api/classes/getAssignmentNames/:name/', (req, res) => { //Finds all assignment names in classes
        const db = req.app.locals.db;
        const name = req.params.name;
        db.collection('classes').find({name}).toArray((err, docs) => {
            if (err) {
                console.log(err.stack);
            } else {
                var classID = docs[0].id;
                db.collection('assignments').find({'classID':classID},{'assignmentName':1,'_id':0}).toArray(function(err, assignmentNames) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send(assignmentNames);
                    }
                });
            }
        });
    });
    
    app.post('/api/classes/newClass', function(req, res) { //Creates a new class
        const db = req.app.locals.db;
        db.collection('classes').find({}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                var uniqueID = 0;
                if (result.length != 0) {
                    uniqueID = result[result.length - 1].id + 1;
                }
                var newClass = {id: uniqueID, name: req.body.name,
                subject: req.body.subject, year: req.body.year,
                students:[], assignments:[], teacher:[]};
                db.collection('classes').insert([newClass], function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send('Success');
                    }
                });
            }
        });
    });
    
    app.post('/api/classes/removeClass', function(req, res) {
        const db = req.app.locals.db;
        const className = req.body.name;
        db.collection('classes').find({'name':className}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                for (var count = 0; count < result[0].assignments.length; count++) {
                    db.collection('assignments').remove({'assignmentName':result[0].assignments[count], 'className':className}, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                db.collection('classes').remove({'name':className}, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                db.collection('students').updateMany({},{$pull:{'classes':className}}, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.send('Success');
            }
        });
    });
};