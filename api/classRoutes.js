const ObjectID = require('mongodb').ObjectID;

module.exports = app => {
    app.get('/api/classes', (req, res) => {
        const db = req.app.locals.db;
        db.collection('classes').find().toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.get('/api/classes/:id', (req, res) => {
        const db = req.app.locals.db;
        const id = parseInt(req.params.id);
        db.collection('classes').find({ id }).toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.post('/api/classes/newClass', function(req, res) {
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
                        res.send('Success')
                    }
                });
            }
        });
    });
};