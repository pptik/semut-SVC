app = require('../app');
var md5 = require('md5');
var moment 	= require('moment');
db = app.db;

exports.login = function (query, callback) {
    db.collection('tb_user', function(err, collection) {
        collection.find({"Email": query['Email']}).toArray(function(err, items) {
         //   console.log(items);
            if(err){
                callback(err, null);
            }else {
                if(items[0]) {
                    if (md5(query['Password']) == items[0].Password) {
                        db.collection('tb_session', function(err, collection) {
                            if(err){
                                callback(err, null);
                            }else {
                                collection.find({"UserID": items[0].ID, "EndTime": "0000-00-00 00:00:00"
                                }).toArray(function(err, items) {
                                    if(err){
                                        callback(null, err);
                                    }else {
                                        //console.log(items);
                                        if(items[0]){

                                        }else {

                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, {success: false, message: "Password tidak cocok"});
                    }
                }else {
                    callback(null, {success: false, message: "Email tidak cocok"});
                }
            }
        });
    });
};
