var app = require('../app');
var db = app.db;

var taxiOrderCollection = db.collection('tb_taxi_order');


function checkOrderHistory(query) {
    return new Promise((resolve, reject) => {
        taxiOrderCollection.find({
            taken_by : query['Profile']['ID']
        }).toArray((err, items) => {
          if(err) reject(err);
          else resolve(items);
        });
    });
}


module.exports = {
    checkOrderHistory:checkOrderHistory
};