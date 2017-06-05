var userModel = require('../model/user_model');
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




exports.signupNotifier = function (call, callback) {
    userModel.findUserName(call['Username'], function (err, username) {
        if(err)callback(err, null);
        else {
            if(username[0])callback(null, messages.username_already_use);
            else {
                if(call['Phonenumber'] != null){
                    userModel.findPhoneNumber(call['Phonenumber'], function (err, number) {
                        if(number[0])callback(null, messages.phone_already_use);
                        else {
                            userModel.insertNotifierUser(call, function (err, user) {
                                if(err)callback(err, null);
                                else callback(null, messages.account_created);
                            });
                        }
                    });
                } else if(call['Email'] != null){
                    userModel.findEmail(call['Email'], function (err, email) {
                        if(email[0])callback(null, messages.email_already_use);
                        else {
                            userModel.insertNotifierUser(call, function (err, user) {
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





exports.getProfile = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if(err){
            callback(err, null);
        }else {
            if(userID != null){
                userModel.getProfileById(userID, function (err, profile) {
                   if(err){
                       callback(err, null);
                   } else {
                       callback(null, {success:true, message: "berhasil memuat permintaan", Profile:profile});
                   }
                });
            }else {
                callback(null, messages.invalid_session);
            }
        }
    })
};


exports.updateOnlineStatus = (query) => {
  return new Promise((resolve, reject) => {
      userModel.checkSession(query['SessionID'], (err, userID) => {
          if(err) reject(err);
          else {
              if(userID != null){
                  userModel.changeOnlineStatus(parseInt(query['Status']), userID).then(items => {
                      var response = {success: true, message: "berhasil update status"};
                      resolve(response);
                  }).catch(err => {
                      reject(err);
                  });
              }else resolve(messages.invalid_session);
          }
      });
  });
};


exports.getProfileById = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
       if(err) callback(err,null);
       else {
           if(userID){
               userModel.getProfileById(parseInt(call['UserID']), function (err, profile) {
                   if(err) callback(err, null);
                   else {
                      if(profile){
                          var res = messages.request_success;
                          res['Profile'] = profile;
                          userModel.getRelationStatus(userID, parseInt(call['UserID']), function (err, friend) {
                             if(err){
                                 callback(err, null);
                             } else {
                                 if(friend == false){
                                     res['Friend'] = false;
                                     callback(null, res);
                                 }else {
                                     res['Friend'] = true;
                                     res['RelationInfo'] = friend;
                                     callback(null, res);
                                 }
                             }
                          });

                      }  else {
                          callback(null, messages.user_not_found);
                      }
                   }
               });
           }else {
               callback(null, messages.invalid_session);
           }
       }
    });
};

exports.searchUser = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if (err) callback(err, null);
        else {
            if (userID) {
                userModel.searchUser(call['Keyword'], userID, function (err, results) {
                   if(results){
                       callback(null, {success: true, message: "Ditemukan "+results.length+" hasil pencarian untuk kata pencarian "+"'"+call['Keyword']+"'", size:results.length,  profiles :results});
                   } else {
                       callback(null, {success: false, message: "Tidak ditemukan hasil untuk kata pencarian "+"'"+call['Keyword']+"'"});
                   }
                });
            }
        }
    });
};