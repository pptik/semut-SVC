var notificationController = require('../controller/notification_controller');
var express = require('express');
var router = express.Router();


router.post('/update', function(req, res, next) {
    var sessid = req.body.SessionID;
    var DeviceToken = req.body.DeviceToken;

    if(sessid === null || DeviceToken === null) {
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        notificationController.updatePushID(req.body).then(function (result) {
            res.status(200).send(result);
        }).catch(function (err) {
            console.log(err);
            res.status(200).send({success: false, message: "Server bermasalah"});
        });
    }
});


module.exports = router;