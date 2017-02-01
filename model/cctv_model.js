app = require('../app');
var moment 	= require('moment');
var autoIncrement = require("mongodb-autoincrement");
db = app.db;


var cctvCollection = db.collection('tb_cctv');


function getCCTVNearby(query, callback) {
    var latitude = parseFloat(query['Latitude']);
    var longitude = parseFloat(query['Longitude']);
    cctvCollection.find(
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
    ).limit(query['Limit']).toArray(function (err, cctvs) {
        if(err)callback(err, null);
        else {
            callback(null, cctvs);
        }
    });


    /*
    cctvCollection.createIndex({location:"2dsphere"}, function (err, res) {
        if(err)callback(err, null);
        else callback(null, res);
    }); */
}


module.exports = {
    getCCTVNearby:getCCTVNearby
};