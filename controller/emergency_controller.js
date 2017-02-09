var emergencyModel = require('../model/emergency_model');
var userModel = require('../model/user_model');
var message = require('../setup/messages.json');

function insertPanicButton(query) {
    return new Promise(function (resolve, reject) {
        userModel.checkCompleteSession(query['SessionID'], function (err, user) {
           if(err)reject(err);
            else {
                if(user){
                    var q = {
                        UserID: user.UserID,
                        Name: user.Name,
                        Email: user.Email,
                        Date: new Date(),
                        Latitude: parseFloat(query['Latitude']),
                        Longitude: parseFloat(query['Longitude']),
                        PhoneNumber: query['PhoneNumber'],
                        location: {
                            type: 'Point',
                            coordinates: [parseFloat(query['Longitude']), parseFloat(query['Latitude'])]
                        },
                        EmergencyID: parseInt(query['EmergencyID'])
                    };
                    emergencyModel.getEmergencyType(q.EmergencyID).then(function (typeName) {
                        q.EmergencyType = typeName;
                        return emergencyModel.insertPanicButton(q);
                    }).then(function (res) {
                        resolve({success:true, message: "berhasil membuat laporan", data:res});
                    }).catch(function (err) {
                        reject(err);
                    });
                }else {
                    resolve(message.invalid_session);
                }
           }
        });
    });
}

module.exports = {
    insertPanicButton:insertPanicButton
};