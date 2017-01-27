app = require('../app');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;

var locationCollection = db.collection('tb_location');
var locationHistoryCollection = db.collection('tb_location_history');
var userCollections = db.collection('tb_user');
var userModel = require('../model/user_model');

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


function getNearby(query, callback) {
    var latitude = parseFloat(query['Latitude']);
    var longitude = parseFloat(query['Longitude']);
    locationCollection.find(
        {
            location:
            { $near :
            {
                $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
                $minDistance: 1,
                $maxDistance: query['Radius']
            }
            }
        }
    ).limit(query['Limit']).toArray(function (err, users) {
       if(err)callback(err, null);
        else {
            //callback(null, users);
           iterateUser(users,function (err, userProfile) {
              if(err)callback(err, null);
               else {
                   //callback(null, userProfile);
                  iterateFriendInfo(userProfile, query['UserID'], function (err, profileComplete) {
                     if(err)callback(err);
                      else callback(null, profileComplete);
                  });
              }
           });
       }
    });
}


function iterateUser(items, callback) {
    for(var i = 0; i< items.length; i++){
        items[i].index = i;
    }
    var arrResult = [];
    items.forEach(function(index){
        userModel.getProfileById(index['UserID'], function (err, profile) {
            if(err)callback(err, null);
            else {
                delete index['_id'];
                delete index['UserID'];
                delete index['flag'];
                delete index['StatusOnline'];
                delete index['location'];
                profile.LastLocation = index;
                arrResult.push(profile);
                if(index['index'] == items.length-1){
                    for(var i = 0; i< arrResult.length; i++){
                        delete arrResult[i].LastLocation.index;
                    }
                    callback(null, arrResult);
                }
            }
        });
    });
}

function iterateFriendInfo(items, UserID, callback) {
    for(var i = 0; i< items.length; i++){
        items[i].index = i;
    }
    var arrResult = [];
    items.forEach(function(index){
        userModel.getRelationStatus(UserID, index['ID'], function (err, profile) {
            if(err)callback(err, null);
            else {
                if(profile == false) index.Friend = false;
                else {
                    index.Friend = true;
                    index.Relation = profile;
                }
                arrResult.push(index);
                if(index['index'] == items.length-1){
                    for(var i = 0; i< arrResult.length; i++){
                        delete arrResult[i].index;
                    }
                    callback(null, arrResult);
                }
            }
        });
    });
}

module.exports = {
    insertOrUpdate:insertOrUpdate,
    insertToHistory:insertToHistory,
    getNearby:getNearby
}