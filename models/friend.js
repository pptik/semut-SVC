app = require('../app');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;


exports.request = function(call, callback){
    checkSession(call.SessionID, function (err, result) {
       if(result.id){
           console.log(result.id);
           if(result.id == parseInt(call.UserID)){
               callback(null, {success: false, message: "Permintaan Anda tidak dapat diproses"})
           }else {
               autoIncrement.getNextSequence(db, 'tb_user', function (err, autoIndex){
                   if(err){
                       callback(err, null);
                   }else {
                       var rellationColl = db.collection('tb_relation');
                       rellationColl.find({ID_REQUEST:result.id, ID_RESPONSE:parseInt(call.UserID)}).toArray(function (err, r) {
                           if(err){
                               callback(err, null);
                           }else {
                               if(r[0]){
                                   callback(null, {success: false, message: "Anda sebelumnya telah mengirim permintaan pertemanan kepada pengguna tersebut"});
                               } else {
                                   var userQuery = {
                                       ID: autoIndex,
                                       ID_REQUEST: result.id,
                                       ID_RESPONSE: parseInt(call.UserID),
                                       RequestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                       State: 1,
                                       reg_flag: 0,
                                       res_flag:0
                                   };
                                   getProfileById(parseInt(call.UserID), function (err, presult) {
                                       if(err){
                                           callback(err,null );
                                       }else {
                                           if(presult.success == false){
                                               callback(null, presult);
                                           }else {
                                               rellationColl.insertOne(userQuery, function (err, Rresult) {
                                                   if(err){
                                                       callback(err, null);
                                                   }else {
                                                       console.log(Rresult.ops);
                                                       getRelationStatus(result.id, parseInt(call.UserID), function (err, fResult) {
                                                           if(err){
                                                               callback(err, null);
                                                           }else {
                                                               var Profile = presult;
                                                               var Relation = fResult;
                                                               callback(null, {success: true, message: "Berhasil mengirimkan permintaan", Profile: Profile, Relation: Relation});
                                                           }
                                                       });
                                                   }
                                               });
                                           }
                                       }
                                   });
                               }
                           }
                       });
                   }
               });
           }
       } else {
           callback(null, result);
       }
    });
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