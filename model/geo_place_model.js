app = require('../app');
db = app.db;

var cityCollection = db.collection('tb_city');
var provinceCollection = db.collection('tb_province');

function getCity(idCity) {
    return new Promise(function(resolve, reject) {
        cityCollection.find({ID:parseInt(idCity)}).toArray(function (err, city) {
            if(err) reject(err);
            else resolve(city[0]);
        });
    });
}


function getProvince(idProvince) {
    return new Promise(function (resolve, reject) {
        provinceCollection.find({ID:parseInt(idProvince)}).toArray(function (err, prov) {
           if(err) reject(err);
            else resolve(prov[0]);
        });
    });
    
}


module.exports = {
    getCity:getCity,
    getProvince:getProvince
};