app = require('../app');
var md5 = require('md5');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;

var userCollection = db.collection('tb_user');
var sessionCollection = db.collection('tb_session');

exports.findEmail = function (email, callback) {
  userCollection.find({Email :email}).toArray(function (err, results) {
      if(err){
          callback(err, null);
      }else {
          callback(null, results);
      }
  });
};



exports.initSession = function (userID, callback) {
    sessionCollection.find({"UserID": userID, "EndTime": "0000-00-00 00:00:00"}).toArray(function (err, results) {
        if(err){
            callback(err, null);
        }else {
            if(results[0]){
                sessionCollection.updateOne({ID: results[0].ID},{ $set: { EndTime : moment().format('YYYY-MM-DD HH:mm:ss')}}, function(err, result) {
                    if(err){
                        callback(err, null);
                    }
                });
            }
            var _query = {UserID: userID, ID: md5(userID+"-"+moment().format('YYYYMMDDHHmmss')),StartTime: moment().format('YYYY-MM-DD HH:mm:ss'), LastTime:moment().format('YYYY-MM-DD HH:mm:ss'), EndTime: "0000-00-00 00:00:00"};
            sessionCollection.insertOne(_query, function (err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        }
    });
};

exports.getSession = function (userID, callback) {
    sessionCollection.find({"UserID": userID, "EndTime": "0000-00-00 00:00:00"}).toArray(function (err, results) {
       if(err){
           callback(err, null);
       } else {
           callback(null, results[0].ID);
       }
    });
};


exports.getProfileById = function(iduser, callback) {
    var userColl = db.collection('tb_user');
    userColl.find({ID: iduser}).toArray(function (err, results) {
        if (err) {
            callback(err, null);
        } else {
            if(results[0]) {
                var data = results[0];
                delete data['Password'];
                delete data['_id'];
                delete data['flag'];
                delete data['foto'];
                delete data['PushID'];
                delete data['Path_foto'];
                delete data['Nama_foto'];
                delete data['Path_ktp'];
                delete data['Nama_ktp'];
                delete data['facebookID'];
                delete data['ID_role'];
                delete data['ID_ktp'];
                delete data['Plat_motor'];
                delete data['VerifiedNumber'];
                delete data['Barcode'];
                delete data['Status_online'];
                callback(null, data);
            }else {
                callback(null, results);
            }
        }
    });
};