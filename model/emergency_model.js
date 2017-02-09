app = require('../app');
db = app.db;

var emergencyCollection = db.collection('tb_emergency');
var emergencyTypeCollection = db.collection('tb_emergency_type');

function insertPanicButton(query) {
    return new Promise(function (resolve, reject) {
        emergencyCollection.insertOne(query, function (err, result) {
            if(err)reject(err);
            else resolve(result.ops[0]);
        });
    });
}


function getEmergencyType(id) {
    return new Promise(function (resolve, reject) {
        emergencyTypeCollection.find({ID:id}).toArray(function (err, results) {
           if(err) reject(err);
            else resolve(results[0]['TypeName']);
        });
    });
}

module.exports = {
    insertPanicButton:insertPanicButton,
    getEmergencyType:getEmergencyType
};


