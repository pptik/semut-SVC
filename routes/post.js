var express = require('express');
var router = express.Router();
var postController = require('../controller/post_controller');

router.post('/getposttype', function(req, res, next) {
    var sessid = req.body.SessionID;
    if(sessid == null) {
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        postController.getPostType(req.body).then(function (list) {
            res.status(200).send(list);
        }).catch(function (err) {
            console.log(err);
            res.status(200).send({success: false, message: "Server bermasalah"});
        });
    }
});

router.post('/insertpost', function (req, res, next) {
    var IDtype = req.body['IDtype'];
    var IDsub = req.body['IDsub'];
    var Type = req.body['Type'];
    var SubType = req.body['SubType'];
    var Times = req.body['Date'];
    var Description = req.body['Description'];
    var Latitude = req.body['Latitude'];
    var Longitude = req.body['Longitude'];
    var Exp = req.body['Expire'];
    var sessid = req.body['SessionID'];
    if(IDtype == null || IDsub == null || Type == null || SubType == null || Times == null || Description == null || Latitude == null || Longitude == null || Exp == null || sessid == null){
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        postController.insertPost(req.body).then(function (response) {
            res.status(200).send(response);
        }).catch(function (err) {
           // console.log(err);
            res.status(200).send({success: false, message: "Server bermasalah"});
        });
    }
});



module.exports = router;