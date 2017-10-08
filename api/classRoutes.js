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
};