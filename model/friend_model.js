app = require('../app');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;

var relationCollection = db.collection('tb_relation');

function checkRelation(user1, user2, callback) {
    relationCollection.find({ID_REQUEST:parseInt(user1), ID_RESPONSE:parseInt(user2)}).toArray(function (err, r) {
        if(err){
            callback(err, null);
        }else {
            if(r[0]){
                callback(null, true);
            }else {
                callback(null, false);
            }
        }
    });
}


function checkRelationByID(relationID, callback) {
    relationCollection.find({ID: parseInt(relationID), State:1}).toArray(function (err, r) {
        if(err){
            callback(err, null);
        }else {
            if(r[0]){
                callback(null, {ID_REQUEST: r[0].ID_REQUEST, ID_RESPONSE: r[0].ID_RESPONSE});
            }else {
                callback(null, false);
            }
        }
    });
}

function insertRequest(user1, user2, callback) {
    autoIncrement.getNextSequence(db, 'tb_relation', 'ID', function (err, autoIndex) {
        if (err) {
            callback(err, null);
        } else {
            var userQuery = {
                ID: autoIndex,
                ID_REQUEST: parseInt(user1),
                ID_RESPONSE: parseInt(user2),
                RequestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                ResponseTime: "",
                State: 1,
                reg_flag: 0,
                res_flag:0
            };
            relationCollection.insertOne(userQuery, function (err, result) {
                if(err){
                    callback(err, null);
                }else {
                    callback(null, result);
                }
            });
        }
    });
}

function updateRelation(realtionID, callback) {
    console.log(realtionID);
    relationCollection.updateOne({ID: realtionID, State: 1}, { $set: { State:2, ResponseTime : moment().format('YYYY-MM-DD HH:mm:ss')}}, function (err, result) {
        if(err){
            callback(err, null);
        }else {
            callback(null, result);
        }
    });
}


module.exports ={
    checkRelation : checkRelation,
    insertRequest : insertRequest,
    checkRelationByID : checkRelationByID,
    updateRelation:updateRelation
};