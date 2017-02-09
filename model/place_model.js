app = require('../app');
db = app.db;

var placeCollection = db.collection('tb_place');

function findNearbyPlace(query) {
    return new Promise(function (resolve, reject) {
        var latitude = parseFloat(query['Latitude']);
        var longitude = parseFloat(query['Longitude']);
        placeCollection.find({$and: [
            {
                location:
                { $near :
                {
                    $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
                    $minDistance: 1,
                    $maxDistance: query['Radius']
                }
                }
            },
            {TypeID:query['Type']}
        ]}).limit(query['Limit']).toArray(function (err, places) {
            if(err)reject(err);
            else {
                resolve(places);
            }
        });
    });
}

module.exports = {
    findNearbyPlace:findNearbyPlace
};
