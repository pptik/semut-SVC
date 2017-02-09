app = require('../app');
db = app.db;

var placeCollection = db.collection('tb_place');

function fixPlace() {
    return new Promise(function (resolve, reject) {
        placeCollection.createIndex({location:"2dsphere"}, function (err, res) {
            if (err)reject(err);
            else resolve(res);
        });
    });
}

module.exports = {
    fixPlace:fixPlace
};
