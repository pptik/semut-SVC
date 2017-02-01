var locationModel = require('../model/location_model');
var cctvModel = require('../model/cctv_model');
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
    query = call;
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if(err)callback(err, null);
        else {
            if(userID){
                checkItem(call['Item'].toString());
                var filter = getFilter(valuesIndex);
                Promise.all([
                    getUserLocation(filter.userLocation, call, userID),
                    getCCTVLocation(filter.cctvPost, call, userID)

                ]).then(function(results) {
                    callback(null, results);
                }).catch(function(err) {
                    callback(err, null);
                });

            }else callback(null, messages.invalid_session);
        }
    });
};


//---------------- function --------------------//

// P R O M I S E S

function getUserLocation(state, query, userID) {
    return new Promise(function(resolve, reject) {
        if(state == true){
            locationModel.getUserNearby(
                {
                    Latitude: parseFloat(query['Latitude']),
                    Longitude: parseFloat(query['Longitude']),
                    UserID: userID,
                    Radius: parseFloat(query['Radius']),
                    Limit: parseInt(query['Limit'])

                }, function (err, users) {
                    if(users) resolve({Users:users});
                    else reject(err);
                });
        }else {
            resolve({Users:[]});
        }
    });
}

function getCCTVLocation(state, query, userID) {
    return new Promise(function(resolve, reject) {
        if(state == true){
            cctvModel.getCCTVNearby(
                {
                    Latitude: parseFloat(query['Latitude']),
                    Longitude: parseFloat(query['Longitude']),
                    UserID: userID,
                    Radius: parseFloat(query['Radius']),
                    Limit: parseInt(query['Limit'])

                }, function (err, users) {
                    if(users) resolve({CCTV:users});
                    else reject(err);
                });
        }else {
            resolve({CCTV:[]});
        }
    });
}





function getFilter(arr) {
    var filter = {};
    for(var i = 0; i < arr.length; i++) {
        for (var k in arr[i]) {
            if (arr[i].hasOwnProperty(k)) {
                filter[k] = arr[i][k];
            }
        }
    }
    return filter;
}

function checkItem(items) {
    items = items.split('');
    for(var i = 0; i <items.length; i++){
        items[i] = parseInt(items[i]);
    }
    if(items.length < valuesIndex.length){
        var _s = valuesIndex.length - items.length;
        for(var i = 0; i < _s; i++){
            items.push(0);
        }
        for(var i =0; i < items.length; i++){
            if(items[i] == 0){
                items[i] = false;
                for(var propName in valuesIndex[i]) {
                    if(valuesIndex[i].hasOwnProperty(propName)) {
                        valuesIndex[i][propName] = false;
                    }
                }
            }else {
                items[i] = true;
                for(var propName in valuesIndex[i]) {
                    if(valuesIndex[i].hasOwnProperty(propName)) {
                        valuesIndex[i][propName] = true;
                    }
                }
            }
        }
        return items;
    }else if(items.length > valuesIndex.length){
        items.splice(valuesIndex.length, items.length-valuesIndex.length);
        for(var i =0; i < items.length; i++){
            if(items[i] == 0){
                items[i] = false;
                for(var propName in valuesIndex[i]) {
                    if(valuesIndex[i].hasOwnProperty(propName)) {
                        valuesIndex[i][propName] = false;
                    }
                }
            }else {
                items[i] = true;
                for(var propName in valuesIndex[i]) {
                    if(valuesIndex[i].hasOwnProperty(propName)) {
                        valuesIndex[i][propName] = true;
                    }
                }
            }
        }
        return items;
    }
}





