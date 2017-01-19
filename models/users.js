app = require('../app');
var md5 = require('md5');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;

exports.login = function (query, callback) {
    db.collection('tb_user', function(err, collection) {
        collection.find({"Email": query['Email']}).toArray(function(err, items) {
            if(err){
                callback(err, null);
            }else {
                if(items[0]) {
                    if (md5(query['Password']) == items[0].Password) {
                        db.collection('tb_session', function(err, collection) {
                            if(err){
                                callback(err, null);
                            }else {
                                var usr_id = items[0].ID;
                                collection.find({"UserID": usr_id, "EndTime": "0000-00-00 00:00:00"
                                }).toArray(function(err, items) {
                                    if(err){
                                        callback(null, err);
                                    }else {
                                        if(items[0]){
                                            collection.updateOne({ID: items[0].ID},{ $set: { EndTime : moment().format('YYYY-MM-DD HH:mm:ss')}}, function(err, result) {
                                                if(err){
                                                    callback(err, null);
                                                }
                                            });
                                        }
                                        var _query = {UserID: usr_id, ID: usr_id+"-"+moment().format('YYYYMMDDHHmmss'),StartTime: moment().format('YYYY-MM-DD HH:mm:ss'), LastTime:moment().format('YYYY-MM-DD HH:mm:ss'), EndTime: "0000-00-00 00:00:00"}
                                        collection.insertOne(_query, function (err, result) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                db.collection('tb_user', function(err, collection) {
                                                    collection.find({"Email": query['Email']}).toArray(function(err, items) {
                                                        if(err){
                                                            callback(err, null);
                                                        }else {
                                                            var profile = items[0];
                                                            delete profile['_id'];
                                                            delete profile['Password'];
                                                            delete profile['flag'];
                                                            delete profile['Barcode'];
                                                            delete profile['ID_role'];
                                                            delete profile['Plat_motor'];
                                                            delete profile['ID_ktp'];
                                                            delete profile['PushID'];
                                                            delete profile['Status_online'];
                                                            delete profile['Nama_foto'];
                                                            delete profile['Path_ktp'];
                                                            delete profile['Nama_ktp'];
                                                            delete profile['VerifiedNumber'];
                                                            db.collection('tb_session', function (err, collection) {
                                                                collection.find({
                                                                    "UserID": usr_id,
                                                                    "EndTime": "0000-00-00 00:00:00"
                                                                }).toArray(function (err, items) {
                                                                    if(err){
                                                                        callback(err, null);
                                                                    }else {
                                                                        callback(null, {success: true, message:"Berhasil melakukan login", sessID: items[0]['ID'], profile: profile});
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                        });
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

exports.regsiter = function (query, callback) {
    var email = query.Email;
    var phonenumber = query.Phonenumber;
    var gender = query.Gender;
    var birthday = query.Birthday;
    var password = query.Password;
    var name = query.Name;

    var userColl = db.collection('tb_user');
    if(userColl){
        userColl.find({"Email": email}).toArray(function(err, items) {
            if(items[0]) {
                callback(null, {success: false, message: "Email sudah digunakan!"});
            }else {
                autoIncrement.getNextSequence(db, 'tb_user', function (err, autoIndex){
                    if(err){
                        console.log(err);
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
                        userColl.insertOne(userQuery, function (err, result) {
                            if(err){
                                console.log(err);
                                callback(err, null);
                            }else {
                                console.log(result.ops);
                                callback(null, {success:true, message: "berhasil membuat akun, silahkan login"});
                            }
                        });
                    }
                });
            }
        });
    }else {
        callback("server error", null);
    }
};
