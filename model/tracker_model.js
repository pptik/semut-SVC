app = require('../app');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;
var trackerCollection = db.collection('tb_tracker')

function findTrackerDevice(Mac, callback) {
    trackerCollection.find({Mac:Mac}).toArray(function (err, items) {
        if (err) {
            callback(err, null);
        } else {
            if (items[0]) {
                callback(null, items[0]);
            } else {
                callback(null, false);
            }
        }
    });
}


function insertTracker(query, callback) {
    trackerCollection.insertOne(query, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

function editTracker(query) {
    return new Promise(function (resolve, reject) {
        trackerCollection.updateOne({Mac:query['Mac']}, {$set:{Keterangan: query['Keterangan']}}, function (err, ok) {
            if(err) reject(err);
            else {
                resolve(ok);
            }
        });
    });
}

function getAllTracker(callback) {
    trackerCollection.find({}).toArray(function (err, items) {
        if(err){
            callback(err, null);
        }else {
            callback(null, items);
        }
    });
}

function getTrackerNearby(query, callback) {
    var latitude = parseFloat(query['Latitude']);
    var longitude = parseFloat(query['Longitude']);
    trackerCollection.find(
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
    ).limit(query['Limit']).toArray(function (err, trackers) {
        if(err)callback(err, null);
        else {
            callback(null, trackers);
            console.log(trackers);
        }
    });
}

module.exports = {
    findTrackerDevice:findTrackerDevice,
    insertTracker:insertTracker,
    getAllTracker:getAllTracker,
    editTracker:editTracker,
    getTrackerNearby:getTrackerNearby
};