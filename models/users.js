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



exports.getProfile = function (call, callback) {
    var sessionId = call.SessionID;
    checkSession(sessionId, function (err, result) {
        if(err){
            console.log(err);
            callback(err, null);
        }else {
            if(result.id){
                getProfileById(result.id, function (err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var res = {
                            success: true,
                            message: "Sukses memuat permintaan",
                            Profile: result
                        };
                        callback(null, res);
                    }
                });
            }else {
                callback(null, result);
            }
        }
    });
};



exports.getProfileById = function (call, callback) {
    var sessionId = call.SessionID;
    var userId = parseInt(call['UserID']);
    checkSession(sessionId, function (err, result) {
        if(err){
            console.log(err);
            callback(err, null);
        }else {
            if(result.id){
                getProfileById(userId, function (err, pResult) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var res = {
                            success: true,
                            message: "Sukses memuat permintaan",
                            Profile: pResult
                        };
                        getRelationStatus(result.id, userId, function (err, rResult) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                if(rResult == false){
                                    res.Friend = false;
                                    callback(null, {response: res});
                                }else {
                                    res.Friend = true;
                                    res.RelationInfo = rResult;
                                    callback(null, res);
                                }
                            }
                        });
                    }
                });
            }else {
                callback(null, result);
            }
        }
    })
};


exports.search = function (call, callback) {
    var sessionId = call.SessionID;
    var key = call.Keyword;
    checkSession(sessionId, function (err, result) {
        if(err){
            console.log(err);
            callback(err, null);
        }else {
            if(result.id){
                searchUser(key, result.id, function (err, results) {
                   if(err){
                       callback(err, null);
                   } else {
                       callback(null, results);
                   }
                });
            }else {
                callback(null, result);
            }
        }
    })
};


//----------------------------------- function ---------------------------------------------//

function checkSession(sessid, callback) {
    var sessionColl = db.collection('tb_session');
    sessionColl.find({ID: sessid}).toArray(function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
          //  console.log(results);
            if(results[0]) {
                callback(null, {id: results[0].UserID});
            }else {
                callback(null, {success:false, message:"Sesi Anda telah habis, silahkan login terlebih dahulu"});
            }
        }
    });
}


function getProfileById(iduser, callback) {
    var userColl = db.collection('tb_user');
    userColl.find({ID: iduser}).toArray(function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log(results[0]);
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
                callback(null, {success:false, message: "User tidak ditemukan"});
            }
        }
    });
}



function getRelationStatus(id1, id2, callback) {
    var relationColl = db.collection('tb_relation');
    relationColl.find({ $or: [ { ID_REQUEST: id1, ID_RESPONSE: id2 }, { ID_REQUEST: id2, ID_RESPONSE: id1 } ] } ).toArray(function (err, results) {
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
}


function searchUser(key, userid, callback) {
    var userColl = db.collection('tb_user');
    userColl.find({$or: [{Name:{'$regex': '.*'+key+'.*'}}, { Email:{'$regex': '.*'+key+'.*'}}]}).toArray(function (err, items) {
       if(err){
           callback(err, null);
       } else {
         //  console.log(items.length);
           if(items.length > 0) {
               iterateUser(items, userid, function (err, results) {
                   if (err) {
                       callback(err, null);
                   } else {
                       callback(null, {success: true, message: "Ditemukan "+results.length+" hasil pencarian untuk kata pencarian "+"'"+key+"'", size:results.length,  profiles :results});
                   }
               });
           }else {
               callback(null, {success: false, message: "Tidak ditemukan hasil untuk kata pencarian "+"'"+key+"'"});
           }
       }
    });
}

function iterateUser(items, userid, callback) {
    for(var i = 0; i< items.length; i++){
        items[i].index = i;
    }
    var arrResult = [];
    items.forEach(function(index){
        getRelationStatus(userid, index['ID'], function (err, result) {
            if(err){
                callback(err, null);
            }else {
                if(result == false){
                    index['Friend'] = false;
                }else {
                    index['Friend'] = true;
                    index['RelationInfo'] = result;
                }
            }
            arrResult.push(index);
            if(index['index'] == items.length-1){
                for(var i = 0; i< arrResult.length; i++){
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
                    delete arrResult[i]['ID_role'];
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
}