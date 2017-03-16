var express = require('express');
var router = express.Router();
var locationController = require('../controller/location_controller');
var configs = require('../setup/configs.json');


router.post('/store', function(req, res, next) {
    console.log(req.body);
    if(req.body['Date'] == null || req.body['Altitude'] == null ||
        req.body['SessionID'] == null || req.body['Latitude'] == null || req.body['Longitude'] == null || req.body['Speed'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        locationController.store(req.body, function (err, result) {
            if(err){
                res.status(200).send({status: false, message:"Server tidak merespon"});
            }else {
                res.status(200).send(result);
            }
        })
    }

});



router.post('/mapview', function(req, res, next) {

    if(req.body['SessionID'] == null || req.body['Radius'] == null || req.body['Limit'] == null
        || req.body['Item'] == null || req.body['Latitude'] == null || req.body['Longitude'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        locationController.mapview(req.body, function (err, result) {
            if(err){
                console.log(err);
                res.status(200).send({status: false, message:"Server tidak merespon"});
            }else {
                res.status(200).send(result);
            }
        })
    }

});

router.post('/placeview', function(req, res, next) {
    if(req.body['SessionID'] == null || req.body['Radius'] == null || req.body['Limit'] == null
        || req.body['Item'] == null || req.body['Latitude'] == null || req.body['Longitude'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        locationController.placeView(req.body).then(function (result) {
            res.status(200).send(result);
        }).catch(function (err) {
            console.log(err);
            res.status(200).send({status: false, message:"Server tidak merespon"});
        });
    }

});

function checkSignature(sig) {
    var state = false;
    for(var i = 0; i < configs.signatures.length; i++){
        if(configs.signatures[i] == sig){
            state = true;
        }
    }
    return state;
}

module.exports = router;