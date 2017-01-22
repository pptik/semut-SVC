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
    userCollection.find({ID: iduser}).toArray(function (err, results) {
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

exports.insertUser = function (query, callback) {
    var email = query.Email;
    var phonenumber = query.Phonenumber;
    var gender = query.Gender;
    var birthday = query.Birthday;
    var password = query.Password;
    var name = query.Name;
    autoIncrement.getNextSequence(db, 'tb_user', function (err, autoIndex){
        if(err){
            callback(err, null);
        }else {
            var userQuery = {
                "ID" : autoIndex,
                "Name" : name,
                "Email" : email,
                "CountryCode" : 62,
                "PhoneNumber" : phonenumber,
                "Gender" : gender,
                "Birthday" : birthday,
                "Password" : md5(password),
                "Joindate" : moment().format('YYYY-MM-DD HH:mm:ss'),
                "Poin" : 100,
                "PoinLevel" : 100,
                "AvatarID" : gender,
                "facebookID" : null,
                "Verified" : 0,
                "VerifiedNumber" : null,
                "Visibility" : 0,
                "Reputation" : 0,
                "flag" : 1,
                "Barcode" : "",
                "deposit" : 0,
                "ID_role" : null,
                "Plat_motor" : null,
                "ID_ktp" : null,
                "foto" : null,
                "PushID" : "no id",
                "Status_online" : null,
                "Path_foto" : null,
                "Nama_foto" : null,
                "Path_ktp" : null,
                "Nama_ktp" : null
            };
            userCollection.insertOne(userQuery, function (err, result) {
                if(err){
                    console.log(err);
                    callback(err, null);
                }else {
                    callback(null, result);
                }
            });
        }
    });
};