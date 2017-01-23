var express = require('express');
var router = express.Router();
var friendController = require('../controller/friend_controller');

router.post('/request', function(req, res, next) {
    console.log(req.body);
    if(req.body['SessionID'] == null || req.body['UserID'] == null) {
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        friendController.request(req.body, function (err, result) {
            if(err){
                res.status(200).send({success: false, message: "Server bermasalah"});
            }else {
                res.status(200).send(result);
            }
        });
    }
});



router.post('/approve', function(req, res, next) {
    console.log(req.body);
    if(req.body['SessionID'] == null || req.body['RelationID'] == null) {
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        // res.status(200).send()
        friendController.approve(req.body, function (err, result) {
            if(err){
                res.status(200).send({success: false, message: "Server bermasalah"});
            }else {
                res.status(200).send(result);
            }
        });
    }
});


module.exports = router;