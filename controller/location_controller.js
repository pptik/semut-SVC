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
    query = call;
    userModel.checkSession(call['SessionID'], function (err, userID) {
        if(err)callback(err, null);
        else {
            if(userID){
                var itemFilter = checkItem(call['Item'].toString());
                console.log(itemFilter);
                var filter = getFilter(valuesIndex);
                Promise.all([getUserLocation(filter.userLocation, call)]).then(function(results) {
                    console.log('Then: ', results);
                }).catch(function(err) {
                    console.log('Catch: ', err);
                });

            }else callback(null, messages.invalid_session);
        }
    });
};


//---------------- function --------------------//

// P R O M I S E S

function getUserLocation(state, query) {
    return new Promise(function(resolve, reject) {
        if(state == true){
            locationModel.getUserNearby(
                {
                    Latitude: parseFloat(query['Latitude']),
                    Longitude: parseFloat(query['Longitude']),
                    UserID: query,
                    Radius: parseFloat(query['Radius']),
                    Limit: parseInt(query['Limit'])

                }, function (err, users) {
                    if(users) resolve(users);
                    else reject(err);
                });
        }else {
            reject({request: false});
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





