app = require('../app');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;

var locationCollection = db.collection('tb_location');
var locationHistoryCollection = db.collection('tb_location_history');
var userCollections = db.collection('tb_user');

function insertOrUpdate(query, callback) {
    locationCollection.find({UserID : parseInt(query['UserID'])}).toArray(function (err, results) {
       if(err)callback(err, null);
       else {
           if(results[0]){
               updateLocation(query, function (err, locationDetail) {
                  if(err)callback(err, null);
                   else callback(null, locationDetail);
               });
           }else {
               insertLocation(query, function (err, locationDetail) {
                  if(err)callback(err, null);
                  else {
                      callback(null, locationDetail);
                  }
               });
           }
       }
    });
}

function insertLocation(query, callback) {
    locationCollection.insertOne(query, function (err, result) {
       if(err)callback(err, null);
       else {
           callback(null, query);
       }
    });
}

function updateLocation(query, callback) {
    locationCollection.updateOne({UserID:query['UserID']}, {$set:query}, function (err, ok) {
        if(err)callback(err, null);
        else callback(null, query);
    });
}

function insertToHistory(query, callback) {
    locationHistoryCollection.insertOne(query, function (err, result) {
       if(err)callback(err, null);
       else callback(null, result);
    });
}


function getNearby(location, params, callback) {
    var latitude = location['Latitude'];
    var longitude = location['Longitude'];

}


//------- use this to update doc with 2d loc
function test(callback) {
    locationCollection.find({}).toArray(function (err, locs) {
       if(err) callback(err, null);
       else {
           for(var i = 0; i< locs.length; i++){
               locs[i].index = i;
           }
           locs.forEach(function(index){
               locationCollection.updateOne({_id: index['_id']},{ $set: { location:[index['Latitude'], index['Longitude']]}}, function(err, result) {
                   if(err){
                       callback(err, null);
                   }else {
                       if(index['index'] == locs.length-1) {
                           callback(null, "success");
                       }
                   }
               });

           });

       }
    });
}



module.exports = {
    insertOrUpdate:insertOrUpdate,
    insertToHistory:insertToHistory,
    getNearby:getNearby,
    test:test
};