var getClassID = function (className, db) { //Gets class ID
    console.log('yes')
    return new Promise(function(resolve) {
        db.collection('classes').find({'name':className}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                var classID = result[0].id;
                resolve(classID);
            }
        });
    });
};

module.exports = {
    getClassID: getClassID
};
