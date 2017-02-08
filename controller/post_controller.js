var postModel = require('../model/post_model');
var messages = require('../setup/messages.json');
var userModel = require('../model/user_model');


function getPostType(query) {
    return new Promise(function (resolve, reject) {
        userModel.checkSession(query['SessionID'], function (err, userID) {
            if(err)reject(err);
            else {
                if(userID){
                    postModel.getPostType().then(function (lists) {
                        resolve({success:true, message:"berhasil memuat permintaan", posts:lists});
                    }).catch(function (err) {
                        reject(err)
                    })
                }else resolve(messages.invalid_session);
            }
        });
    });
}

function insertPost(query) {
    return new Promise(function (resolve, reject) {
        userModel.checkCompleteSession(query['SessionID'], function (err, details) {
            if(err)reject(err);
            else {
                if(details){
                    query.user = details;
                    postModel.insertPost(query).then(function (resp) {
                        resolve({success:true, message:"Berhasil menambahkan post", data:resp});
                    }).catch(function (err) {
                        reject(err);
                    });
                }else resolve(messages.invalid_session);
            }
        });
    });
}


module.exports = {
    getPostType:getPostType,
    insertPost:insertPost
};