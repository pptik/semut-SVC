var express = require('express');
var router = express.Router();
var emergencyController = require('../controller/emergency_controller');


router.post('/insertemergency', function(req, res, next) {
    if(req.body['SessionID'] == null || req.body['EmergencyID'] == null || req.body['PhoneNumber'] === null
        || req.body['Latitude'] == null || req.body['Longitude'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        emergencyController.insertPanicButton(req.body).then(function (result) {
            res.status(200).send(result);
        }).catch(function (err) {
            console.log(err);
            res.status(200).send({status: false, message:"Server tidak merespon"});
        });
    }

});


router.post('/get', function(req, res, next) {
    if(req.body['SessionID'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        emergencyController.getEmergencyPost(req.body).then(function (result) {
            res.status(200).send(result);
        }).catch(function (err) {
            console.log(err);
            res.status(200).send({status: false, message:"Server tidak merespon"});
        });
    }

});


module.exports = router;