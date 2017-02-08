app = require('../app');
db = app.db;

var postCollection = db.collection('tb_post');
var postTypeCollection = db.collection('tb_post_type');

function findPostNearby(query) {
  //  var dateNow = new Date();
    var dateNow = '2014-05-21 09:12:46';
    var latitude = parseFloat(query['Latitude']);
    var longitude = parseFloat(query['Longitude']);
    console.log(new Date(dateNow));
    return new Promise(function (resolve, reject) {
        postCollection.find(
            {$and: [
                {
                    Exp : { $gte : new Date(dateNow)}},
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
                {SubType:query['Type']}
            ]})
            .limit(query['Limit']).toArray(function (err, posts) {
            if(err)reject(err);
            else {
                for(var i=0;i<posts.length;i++){
                    posts[i]['Times'] = convertISODateToString(posts[i]['Times']);
                    posts[i]['Exp'] = convertISODateToString(posts[i]['Exp']);
                }
                resolve(posts);
            }
        });
    });
}

function getPostType() {
    return new Promise(function (resolve, reject) {
       postTypeCollection.find({}).toArray(function (err, ress) {
           if(err) reject(err);
           else resolve(ress);
       });
    });
}

function insertPost(query) {
    return new Promise(function (resolve, reject) {
       var q = {
           IDtype:parseInt(query['IDtype']),
           IDsub:parseInt(query['IDsub']),
           Type: query['Type'],
           SubType: query['SubType'],
           Times: new Date(query['Date']),
           Description: query['Description'],
           Latitude: parseFloat(query['Latitude']),
           Longitude: parseFloat(query['Longitude']),
           Exp: new Date(query['Expire']),
           Status: 0,
           location: {
               type: 'Point',
               coordinates: [parseFloat(query['Longitude']), parseFloat(query['Latitude'])]
           },
           PostedBy: query.user
       };
       postCollection.insertOne(q, function (err, res) {
          if(err)reject(err);
           else resolve(res.ops[0]);
       });
    });
}

function convertISODateToString(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dt = date.getDate();
    var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year+'-' + month + '-'+dt+' '+time;
}

module.exports = {
    findPostNearby:findPostNearby,
    getPostType:getPostType,
    insertPost:insertPost
};