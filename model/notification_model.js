var app = require('../app');
var db = app.db;
var userCollection = db.collection('tb_user');



function updatePushID(query) {
    return new Promise(function (resolve, reject) {
        userCollection.updateOne({ID: query['UserID']}, { $set: { PushID: query['DeviceToken']}}, function (err, results) {
            if(err)reject(err);
            else resolve(results);
        });
    });
}


module.exports = {
    updatePushID:updatePushID
};