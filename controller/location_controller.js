var locationModel = require('../model/location_model');
var userModel = require('../model/user_model');
var messages = require('../setup/messages.json');

var mapValues = {
    userpost: 1,
    cctvpost: 2,
    policepost: 4,
    accidentpost: 8,
    trafficpost: 16,
    otherpost: 32,
    commutertrain: 64,
    angkot: 128
};

exports.store = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
       if(err)callback(err, null);
       else {
           if(userID){
               var query = {
                   'UserID': userID,
                   'Date': call['Date'],
                   'Altitude': parseFloat(call['Altitude']),
                   'Latitude': parseFloat(call['Latitude']),
                   'Longitude': parseFloat(call['Longitude']),
                   'Speed': parseFloat(call['Speed'])
               };
               locationModel.insertOrUpdate(query, function (err, result) {
                  if(err)callback(err, null);
                  else{
                      locationModel.insertToHistory(query, function (err, res) {
                         if(err)callback(err, null);
                         else  callback(null, {success: true, message: "Sukses insert lokasi", location: query});
                      });
                  }
               });
           }else callback(null, messages.invalid_session);
       }
    });
};

exports.mapview = function (call, callback) {
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if(err)callback(err, null);
        else {
            if(userID){

            }else callback(null, messages.invalid_session);
        }
    });
};

