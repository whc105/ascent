const ObjectID = require('mongodb').ObjectID;

module.exports = app => {
    app.get('/api/assignments', (req, res) => {
        const db = req.app.locals.db;
        db.collection('assignments').find().toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
};