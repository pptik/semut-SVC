var locationModel = require('../model/location_model');
var userModel = require('../model/user_model');
var messages = require('../setup/messages.json');

var valuesIndex = [
    {userLocation:0},
    {userPost: 1},
    {cctvPost: 2},
    {policePost: 3},
    {accidentPost: 4},
    {trafficPost: 5},
    {otherPost: 6},
    {commuterTrain: 7},
    {angkotLocation: 8}
];

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
                   'Speed': parseFloat(call['Speed']),
                   'location':{
                       'type': 'Point',
                       'coordinates': [parseFloat(call['Longitude']), parseFloat(call['Latitude'])]
                   }
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
                locationModel.getNearby(
                    {
                        Latitude: parseFloat(call['Latitude']),
                        Longitude: parseFloat(call['Longitude']),
                        UserID: userID,
                        Radius: parseFloat(call['Radius']),
                        Limit: parseInt(call['Limit']),
                        Item : parseInt(call['Item'])

                    }, function (err, users) {
                   if(err) callback(err, null);
                    else {
                        callback(null, users);
                   }
                });
            }else callback(null, messages.invalid_session);
        }
    });
};





