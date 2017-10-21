const ObjectID = require('mongodb').ObjectID;

module.exports = app => {
    app.get('/api/rubrics', (req, res) => {
        const db = req.app.locals.db;
        db.collection('rubrics').find().toArray( (err, docs) => {
            if (err) console.log(err.stack);
            res.send(docs);
        });
    });
    
    app.post('/api/rubrics/remove', (req, res) => {
        const db = req.app.locals.db;
        db.collection('rubrics').remove({'rubricName':req.body.name}, function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/rubrics');
            }
        });
    });
};