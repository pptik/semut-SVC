var friendModel = require('../model/friend_model');
var userModel = require('../model/user_model');
var messages = require('../setup/messages.json');

exports.request = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if(err){
            callback(err, null);
        }else {
            if(userID != null){
                friendModel.checkRelation(userID, call['UserID'], function (err, status) {
                   if(status){
                        callback(null, messages.already_sent_request);
                   }else {
                        friendModel.insertRequest(userID, call['UserID'], function (err, result) {

                           if(err){
                               callback(err, null);
                           } else {
                                userModel.getRelationStatus(userID, call['UserID'], function (err, relationInfo) {
                                   if(err){
                                       callback(err, null);
                                   } else {
                                       userModel.getProfileById(call['UserID'], function (err, profile) {
                                           if(err){
                                               callback(err, null);
                                           }else {
                                               callback(null, {success: true, message: "Berhasil mengirimkan permintaan", Profile: profile, Relation: relationInfo})
                                           }
                                       })
                                   }
                                });
                           }
                        });
                   }
                });
            }else {
                callback(null, messages.invalid_session);
            }
        }
    });
};

exports.approve = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if (err) {
            callback(err, null);
        } else {
            if(userID != null){
                friendModel.checkRelationByID(call['RelationID'], function (err, result) {
                   if(err){
                       callback(err, null);
                   } if(result == false){
                       callback(null, messages.relation_not_found);
                    }else {
                        friendModel.updateRelation(call['RelationID'], function (err, result) {
                           if(err){
                               callback(err, null);
                           } else {
                               callback(null, result);
                           }
                        });
                    }
                });
            }else {
                callback(null, messages.invalid_session);
            }
        }
    });
};