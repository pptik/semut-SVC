var express = require('express');
var router = express.Router();
var trackerModel = require('../models/tracker');

router.post('/register', function(req, res, next) {
    console.log(req.body);
    if(req.body['Mac'] == null || req.body['Keterangan'] == null){
        res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    }else {
        var request = {
            Mac: req.body['Mac'],
            Speed : 0,
            Date : "",
            Time : "",
            Data: [0,0],
            Lokasi: "",
            Keterangan: req.body['Keterangan']
        };
        trackerModel.register(request, function (err, result) {
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
   if(req.body['sessionID'] == null){
       res.status(200).send({success:false, message:"Parameter tidak lengkap"});
   }else {
        trackerModel.getalltracker(req.body, function (err, results) {
           if(err){
               res.status(200).send({status: false, message:"Server tidak merespon"});
           } else {
               res.status(200).send({status: true, message:"Sukses memuat permintaan", trackers: results});
           }
        });
   }
});

module.exports = router;