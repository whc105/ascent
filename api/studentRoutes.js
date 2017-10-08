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
};