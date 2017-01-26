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

function getAllTracker(callback) {
    trackerCollection.find({}).toArray(function (err, items) {
        if(err){
            callback(err, null);
        }else {
            callback(null, items);
        }
    });
}

module.exports = {
    findTrackerDevice:findTrackerDevice,
    insertTracker:insertTracker,
    getAllTracker:getAllTracker
};