var messages = require('../setup/messages.json');
var trackerModel = require('../model/tracker_model');
var userModel = require('../model/user_model');

exports.register = function (call, callback) {
  userModel.checkSession(call['SessionID'], function (err, userID) {
     if(err) callback(err, null);
      else {
          if(userID){
              trackerModel.findTrackerDevice(call['Mac'], function (err, tracker) {
                  if(err) callback(err, null);
                  else {
                    if(tracker) callback(null, messages.gps_tracker_already_register);
                    else {
                        delete call['SessionID'];
                        trackerModel.insertTracker(call, function (err, result) {
                           if(err) callback(err, null);
                           else {
                               callback(null, {success:true, message: "berhasil mendaftarkan tracker"});
                           }
                        });
                    }
                 }
              });
          }else callback(null, messages.invalid_session);
     }
  });
};


exports.getalltracker = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if (err) callback(err, null);
        else {
            if (userID) {
                trackerModel.getAllTracker(function (err, items) {
                   if(err)callback(err, null);
                   else {
                       callback(null, {success:true, message: "Berhasil memuat permintaan", tracker: items});
                   }

                });
            }else {
                callback(null, messages.invalid_session);
            }
        }
    });
};