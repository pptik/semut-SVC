app = require('../app');
db = app.db;

var postCollection = db.collection('tb_post');

function findPostNearby(query) {
    var dateNow = '2014-05-21 09:12:46';
    console.log(new Date(dateNow));
    return new Promise(function (resolve, reject) {
        postCollection.find({"Exp" : { $gte : new Date(dateNow)}}).limit(query['Limit']).toArray(function (err, posts) {
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
    findPostNearby:findPostNearby
};