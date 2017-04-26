var notoficationModel = require('../model/notification_model');
var userModel = require('../model/user_model');

function updatePushID(query) {
    return new Promise(function (resolve, reject) {
        userModel.checkSession(query['SessionID'], function (err, userID) {
            if (err) reject(err);
            else {
                if (userID) {
                    query['UserID'] = userID;
                    notoficationModel.updatePushID(query).then(function (results) {
                        resolve({success:true, message:"berhasil update Push ID", raw: results});
                    }).catch(function (err) {
                        reject(err);
                    })
                }
            }
        });
    });
}


module.exports = {
    updatePushID:updatePushID
};