app = require('../app');
db = app.db;

var emergencyCollection = db.collection('tb_emergency');
var emergencyTypeCollection = db.collection('tb_emergency_type');

function insertPanicButton(query) {
    return new Promise(function (resolve, reject) {
        emergencyCollection.insertOne(query, function (err, result) {
            if(err)reject(err);
            else resolve(result.ops[0]);
        });
    });
}


function getEmergencyType(id) {
    return new Promise(function (resolve, reject) {
        emergencyTypeCollection.find({ID:id}).toArray(function (err, results) {
           if(err) reject(err);
            else resolve(results[0]['TypeName']);
        });
    });
}

function getEmergencyPost() {
    return new Promise(function (resolve, reject) {
       emergencyCollection.find({}).sort( { Date: -1 } ).toArray(function (err, items) {
          if(err)reject(err);
          else resolve(removeLocation(items));
       });
    });
}



function removeLocation(array) {
    if(array.length > 0){
        array.forEach(function (item) {
           delete item['location'];
           item['Date'] = convertISODateToString(item['Date']);
        });
        return array;
    }else {
        return array;
    }
}


function convertISODateToString(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dt = date.getDate();
    var time = addZero(date.getHours())+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year+'-' + month + '-'+dt+' '+time;
}


function addZero(number) {
    number = parseInt(number);
    var s = "";
    if(number < 10){
        s = '0'+number.toString();
    }else s = number.toString();

    return s;
}

module.exports = {
    insertPanicButton:insertPanicButton,
    getEmergencyType:getEmergencyType,
    getEmergencyPost:getEmergencyPost
};


