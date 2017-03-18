var express = require('express');
var router = express.Router();
var trackerController = require('../controller/tracker_controller');

router.post('/register', function(req, res, next) {
    console.log(req.body);
    if(req.body['Mac'] == null || req.body['Keterangan'] == null || req.body['SessionID'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        var request = {
            SessionID: req.body['SessionID'],
            Mac: req.body['Mac'],
            Speed : 0,
            Date : "",
            Time : "",
            Data: [0,0],
            Lokasi: "",
            Keterangan: req.body['Keterangan']
        };
        trackerController.register(request, function (err, result) {
            if(err){
                res.status(200).send({status: false, message:"Server tidak merespon"});
            }else {
                console.log(result);
                res.status(200).send(result);
            }
        })
    }

});

router.post('/getalltracker', function (req, res, next) {
   if(req.body['SessionID'] == null){
       res.status(200).send({success:false, message:"Parameter tidak lengkap"});
   }else {
        trackerController.getalltracker(req.body, function (err, results) {
           if(err){
               res.status(200).send({status: false, message:"Server tidak merespon"});
           } else {
               res.status(200).send(results);
           }
        });
   }
});

router.post('/editracker', function (req, res, next) {
    if(req.body['SessionID'] == null || req.body['Keterangan'] == null || req.body['Mac'] == null){
        res.status(200).send({success:false, message:"Parameter tidak lengkap"});
    }else {
        trackerController.edittracker(req.body).then(function (result) {
            res.status(200).send(result);
        }).catch(function (err) {
            console.log(err);
            res.status(200).send({status: false, message:"Server tidak merespon"});
        })
    }
});

module.exports = router;