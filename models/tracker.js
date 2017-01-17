app = require('../app');
db = app.db;


exports.register = function (query, callback) {
    db.collection('tb_tracker', function (err, collection) {
        collection.find({Mac:query.Mac}).toArray(function (err, items) {
           if(err){
               callback(err, null);
           }else {
               if(items[0]){
                   callback(null, {success:false, message: "device sudah terdaftar"});
               }else {
                   collection.insertOne(query, function (err, result) {
                       if (err) {
                           callback(err, null);
                       } else {
                           callback(null, {success: true, message:"Berhasil mendaftarkan device"});
                       }
                   });
               }
           }
        });
    });
};

exports.getalltracker = function (query, callback) {
    db.collection('tb_tracker', function (err, collection) {
        collection.find({}).toArray(function (err, items) {
            if(err){
                callback(err, null);
            }else {
                callback(null, items);
            }
        });
    });
};
