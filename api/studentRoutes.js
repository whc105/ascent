const ObjectID = require('mongodb').ObjectID;

module.exports = app => {
    app.get('/api/students', (req, res) => {
        const db = req.app.locals.db;
        db.collection('students').find().toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.get('/api/students/:id', (req, res) => {
        const db = req.app.locals.db;
        const id = req.params.id;
        db.collection('students').find({ id }).toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.post('/api/students/remove', (req, res) => {
        const db = req.app.locals.db;
        var idList = req.body.id;
        for (var count = 0; count < idList.length; count++) {
            db.collection('students').remove({'id':idList[count]}, function(err, result){
                if (err) {
                   console.log(err);
                }
            });
            db.collection('classes').updateMany({'students':idList[count]}, {$pull:{'students':idList[count]}}, function(err, result) {
                if (err) {
                    console.log(err);
                }
            });
            db.collection('assignments').updateMany({}, {$pull:{'students':{'id':idList[count]}}}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
        res.redirect('/studentList');
    })
};