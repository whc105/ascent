var getClassID = function (className, db) { //Gets class ID
    return new Promise(function(resolve) {
        db.collection('classes').find({'name':className}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result.length != 0) {
                    resolve(result[0].id);
                } else {
                    resolve(new Error());
                }
            }
        });
    });
};

module.exports = {
    getClassID: getClassID
};
