var express = require('express');
var router = express.Router();
var friendModel = require('../models/friend');

router.post('/request', function(req, res, next) {
    console.log(req.body);
    if(req.body['SessionID'] == null || req.body['UserID'] == null) {
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        // res.status(200).send()
        friendModel.request(req.body, function (err, result) {
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
        friendModel.accept(req.body, function (err, result) {
            if(err){
                res.status(200).send({success: false, message: "Server bermasalah"});
            }else {
                res.status(200).send(result);
            }
        });
    }
});


module.exports = router;