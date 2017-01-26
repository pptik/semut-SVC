var express = require('express');
var router = express.Router();
var locationController = require('../controller/location_controller');


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


module.exports = router;