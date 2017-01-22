var userModel = require('../model/user_model');
var md5 = require('md5');

exports.login = function (call, callback) {
    userModel.findEmail(call['Email'], function (err, result) {
       if(err){
           callback(err, null);
       } else {
           if(result[0]){
                var password = result[0].Password;
               if(md5(call['Password']) == password){
                   userModel.initSession(result[0].ID, function (err, session) {
                      if(err){
                          callback(err, null);
                          console.log(err);
                      } else {
                          userModel.getProfileById(result[0].ID, function (err, profile) {
                             if(err){
                                 callback(err, null);
                                 console.log(err);
                             } else {
                                 userModel.getSession(result[0].ID, function (err, sessID) {
                                    if(err){
                                        console.log(err);
                                        callback(err, null);
                                    } else {
                                        callback(null, {success: true, message: "Berhasil melakukan Login", SessionID: sessID, Profile: profile});
                                    }
                                 });
                             }
                          });
                      }
                   });
               }else {
                   callback(null, {success:false, message: "Alamat email atau kata sandi tidak tepat"});
               }
           }else {
               callback(null, {success:false, message: "Alamat email atau kata sandi tidak tepat"});
           }
       }
    });
};

exports.signup = function (call, callback) {
  userModel.findEmail(call['Email'], function (err, emails) {
     if(err){
         callback(err, null);
     } else {
         if(emails[0]){
             callback(null, {success:false, message: "Email sudah terdaftar"});
         }else {
             userModel.insertUser(call, function (err, user) {
                if(err){
                    callback(err, null);
                } else {
                    callback(null, {success:true, message: "Berhasil membuat akun"});
                }
             });
         }
     }
  });
};