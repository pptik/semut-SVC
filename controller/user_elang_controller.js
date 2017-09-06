var userModel = require('../model/user_elang_model');
var md5 = require('md5');
var messages = require('../setup/messages.json');

exports.login = function (call, callback) {
    if(call['Email'] != null) {
        userModel.findEmail(call['Email'], function (err, result) {
            if (err)callback(err, null);
            else {
                if (result[0]) {
                    var password = result[0].Password;
                    if (md5(call['Password']) == password) {
                        userModel.initSession(result[0].ID, function (err, session) {
                            if (err)callback(err, null);
                            else {
                                userModel.getProfileById(result[0].ID, function (err, profile) {
                                    if (err)callback(err, null);
                                    else {
                                        userModel.getSession(result[0].ID, function (err, sessID) {
                                            if (err)callback(err, null);
                                            else callback(null, {
                                                success: true,
                                                message: "Berhasil melakukan Login",
                                                SessionID: sessID,
                                                Profile: profile
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    } else callback(null, messages.email_or_password_invalid);
                } else callback(null, messages.email_or_password_invalid);
            }
        });
    }else if(call['Phonenumber'] != null) {
        userModel.findPhoneNumber(call['Phonenumber'], function (err, result) {
            if (err)callback(err, null);
            else {
                if (result[0]) {
                    var password = result[0].Password;
                    if (md5(call['Password']) == password) {
                        userModel.initSession(result[0].ID, function (err, session) {
                            if (err)callback(err, null);
                            else {
                                userModel.getProfileById(result[0].ID, function (err, profile) {
                                    if (err)callback(err, null);
                                    else {
                                        userModel.getSession(result[0].ID, function (err, sessID) {
                                            if (err)callback(err, null);
                                            else callback(null, {
                                                success: true,
                                                message: "Berhasil melakukan Login",
                                                SessionID: sessID,
                                                Profile: profile
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    } else callback(null, messages.email_or_password_invalid);
                } else callback(null, messages.email_or_password_invalid);
            }
        });
    }else callback(null, messages.parameter_not_completed);
};

exports.signup = function (call, callback) {
  userModel.findUserName(call['Username'], function (err, username) {
     if(err)callback(err, null);
      else {
         if(username[0])callback(null, messages.username_already_use);
         else {
             if(call['Phonenumber'] != null){
                userModel.findPhoneNumber(call['Phonenumber'], function (err, number) {
                    if(number[0])callback(null, messages.phone_already_use);
                    else {
                        userModel.insertUser(call, function (err, user) {
                            if(err)callback(err, null);
                            else callback(null, messages.account_created);
                        });
                    }
                });
             } else if(call['Email'] != null){
                 userModel.findEmail(call['Email'], function (err, email) {
                     if(email[0])callback(null, messages.email_already_use);
                     else {
                         userModel.insertUser(call, function (err, user) {
                             if(err)callback(err, null);
                             else callback(null, messages.account_created);
                         });
                     }
                 });
             }else callback(null, messages.parameter_not_completed);


         }
     }
  });
};

