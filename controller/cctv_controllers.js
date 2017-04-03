var cctvModel = require('../model/cctv_model');
var messages = require('../setup/messages.json');
var userModel = require('../model/user_model');

function getallcctv(query) {
    return new Promise(function (resolve, reject) {
        userModel.checkSession(query['SessionID'], function (err, userID) {
            if(userID){
                cctvModel.getAllCctv().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                   reject(err);
                });
            }else resolve(messages.invalid_session);
        });
    });
}


module.exports = {
    getallcctv:getallcctv
};