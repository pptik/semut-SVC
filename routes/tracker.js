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
            date : "",
            time : "",
            data: [0,0],
            keterangan: req.body['Keterangan']
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

module.exports = router;