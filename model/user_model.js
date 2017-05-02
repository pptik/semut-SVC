app = require('../app');
var md5 = require('md5');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;

var userCollection = db.collection('tb_user');
var sessionCollection = db.collection('tb_session');
var relationCollection = db.collection('tb_relation');

exports.findEmail = function (email, callback) {
  userCollection.find({Email :email}).toArray(function (err, results) {
      if(err){
          callback(err, null);
      }else {
          callback(null, results);
      }
  });
};

exports.findPhoneNumber = function (phoneNumber, callback) {
    userCollection.find({PhoneNumber :phoneNumber}).toArray(function (err, results) {
        if(err){
            callback(err, null);
        }else {
            console.log(results);
            callback(null, results);
        }
    });
};


exports.findUserName = function (username, callback) {
    userCollection.find({username :username}).toArray(function (err, results) {
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

exports.checkSession = function(sessid, callback) {
    sessionCollection.find({ID: sessid}).toArray(function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if(results[0]) {
                callback(null, results[0].UserID);
            }else {
                callback(null, null);
            }
        }
    });
};


exports.checkCompleteSession = function(sessid, callback) {
    sessionCollection.find({ID: sessid}).toArray(function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if(results[0]) {
                userCollection.find({ID: results[0].UserID}).toArray(function (err, ress) {
                   if(err)callback(err, null);
                    else callback(null, {UserID: results[0].UserID, Name: ress[0].Name, Email: ress[0].Email});
                });
            }else {
                callback(null, null);
            }
        }
    });
};


exports.getProfileById = function(iduser, callback) {
    var _id = parseInt(iduser);
    userCollection.find({ID: _id}).toArray(function (err, results) {
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
                callback(null, null);
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
    var username = query.Username;
    autoIncrement.getNextSequence(db, 'tb_user', 'ID', function (err, autoIndex){
        if(err){
            callback(err, null);
        }else {
            var userQuery = {
                "ID" : autoIndex,
                "Name" : name,
                "username" : username,
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




exports.insertNotifierUser = function (query, callback) {
    var email = query.Email;
    var phonenumber = query.Phonenumber;
    var gender = query.Gender;
    var birthday = query.Birthday;
    var password = query.Password;
    var name = query.Name;
    var username = query.Username;
    autoIncrement.getNextSequence(db, 'tb_user', 'ID', function (err, autoIndex){
        if(err){
            callback(err, null);
        }else {
            var userQuery = {
                "ID" : autoIndex,
                "Name" : name,
                "username" : username,
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
                "ID_role" : 5,
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




exports.getRelationStatus = function(id1, id2, callback) {
    relationCollection.find({ $or: [ { ID_REQUEST: parseInt(id1), ID_RESPONSE: parseInt(id2) }, { ID_REQUEST: parseInt(id2), ID_RESPONSE: parseInt(id1) } ] } ).toArray(function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if(results[0]) {
                var friend = {};
                friend['RelationID'] = results[0].ID;
                friend['IsRequest'] = false;
                if(results[0].ID_REQUEST == id2){
                    friend['IsRequest'] = true;
                }
                if(results[0].State == 1) friend['Status'] = "Pending"; else friend['Status'] = "Confirmed";
                callback(null, friend);
            }else {
                callback(null, false);
            }
        }
    });
};


exports.searchUser = function(key, userID, callback) {
    userCollection.find({$or: [{Name:{'$regex': '.*'+key+'.*'}}, { Email:{'$regex': '.*'+key+'.*'}}]}).toArray(function (err, items) {
        if(err){
            callback(err, null);
        } else {
            if(items.length > 0) {
                iterateUser(items, userID, function (err, results) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, results);
                    }
                });
            }else {
                callback(null, null);
            }
        }
    });


    function getRelationStatus(id1, id2, callback) {
        relationCollection.find({ $or: [ { ID_REQUEST: id1, ID_RESPONSE: id2 }, { ID_REQUEST: id2, ID_RESPONSE: id1 } ] } ).toArray(function (err, results) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if(results[0]) {
                    var friend = {};
                    friend['RelationID'] = results[0].ID;
                    friend['IsRequest'] = false;
                    if(results[0].ID_REQUEST == id2){
                        friend['IsRequest'] = true;
                    }
                    if(results[0].State == 1) friend['Status'] = "Pending"; else friend['Status'] = "Confirmed";
                    callback(null, friend);
                }else {
                    callback(null, false);
                }
            }
        });
    };

    function iterateUser(items, userid, callback) {
        for(var i = 0; i< items.length; i++){
            items[i].index = i;
        }
        var arrResult = [];
        var maxCount = (items.length > 0) ? items.length-1 : 0;
        if(items.length > 0) {
            items.forEach(function (index) {
                getRelationStatus(userid, index['ID'], function (err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (result == false) {
                            index['Friend'] = false;
                        } else {
                            index['Friend'] = true;
                            index['RelationInfo'] = result;
                        }
                    }
                    arrResult.push(index);
                    if (index['index'] == maxCount) {
                        for (var i = 0; i < arrResult.length; i++) {
                            delete arrResult[i]['index'];
                            delete arrResult[i]['Password'];
                            delete arrResult[i]['_id'];
                            delete arrResult[i]['flag'];
                            delete arrResult[i]['foto'];
                            delete arrResult[i]['PushID'];
                            delete arrResult[i]['Path_foto'];
                            delete arrResult[i]['Nama_foto'];
                            delete arrResult[i]['Path_ktp'];
                            delete arrResult[i]['Nama_ktp'];
                            delete arrResult[i]['facebookID'];
                          //  delete arrResult[i]['ID_role'];
                            delete arrResult[i]['ID_ktp'];
                            delete arrResult[i]['Plat_motor'];
                            delete arrResult[i]['VerifiedNumber'];
                            delete arrResult[i]['Barcode'];
                            delete arrResult[i]['Status_online'];
                        }
                        callback(null, arrResult);
                    }
                });

            });
        }else {callback(null, [])}
    }
};