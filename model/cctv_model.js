app = require('../app');
db = app.db;


var cctvCollection = db.collection('tb_cctv');
var cityCollection = db.collection('tb_city');


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
            callback(null, fixStreamUrl(cctvs));
        }
    });
}


function getAllCctv() {
    return new Promise(function (resolve, reject) {
        cityCollection.find({}).toArray(function (err, cities) {
           if(err)reject(err);
            else {
                if(cities.length > 0){
                    cities.forEach(function (index) {
                        getCctvList(index['ID']).then(function (lists) {
                            index['cctv'] = lists;
                            if(cities.indexOf(index) == cities.length-1){
                                resolve(cities);
                            }
                        }).catch(function (err) {
                           reject(err);
                        });
                    });
                }else resolve(cities);
           }
        });
    });
}

function getCctvList(cityId) {
    return new Promise(function (resolve, reject) {
       cctvCollection.find({CityID: cityId}).toArray(function (err, result) {
          if(err)reject(err);
           else {
               resolve(fixStreamUrl(result));
           }
       });
    });
}


function fixStreamUrl(items) {
    for(var i =0; i < items.length; i++){
        items[i]['urlVideo'] = items[i]['urlVideo']+items[i]['ItemID'];
        items[i]['urlImage'] = items[i]['urlImage']+items[i]['ItemID'];
    }
    return items;
}


module.exports = {
    getCCTVNearby:getCCTVNearby,
    getAllCctv:getAllCctv
};