app = require('../app');
db = app.db;

var placeCollection = db.collection('tb_place');

function fixPlace() {
    return new Promise(function (resolve, reject) {
       placeCollection.find({}).toArray(function (err, places) {
           if(err)reject(err);
           else {
               places.forEach(function (place) {
                   console.log("processing", place['_id']);
                  if(place['_id'] == places[places.length-1]['_id']){
                      if(place['TypeID'] == 1) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Food', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                             if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 2) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Hotel', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 3) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Fashion', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 4) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Gas Station', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 5) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'School', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 6) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'University', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 7) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Hospital', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 8) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Bank', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      }else if(place['TypeID'] == 9) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Station', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 10) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Department Store', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      } else if(place['TypeID'] == 11) {
                          placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Parking Area', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                              if(err)reject(err);
                              else resolve(sukses);
                          });
                      }
                  } else {
                       if(place['TypeID'] == 1) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Food', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 2) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Hotel', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 3) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Fashion', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 4) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Gas Station', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 5) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'School', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 6) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'University', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 7) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Hospital', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 8) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Bank', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       }else if(place['TypeID'] == 9) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Station', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 10) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Department Store', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       } else if(place['TypeID'] == 11) {
                           placeCollection.updateOne({_id: place['_id']}, {$set: {PlaceType: 'Parking Area', location:{type: 'Point', coordinates:[place['Longitude'], place['Latitude']]}}}, function (err, sukses) {
                               if(err)reject(err);
                           });
                       }
                   }
               });
           }
       });
    });
}

module.exports = {
    fixPlace:fixPlace
};
