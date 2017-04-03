var express = require('express');
var router = express.Router();
var cctvControllers = require('../controller/cctv_controllers');


router.post('/getall', function(req, res, next) {
    console.log(req.body);
    var query = req.body;
    if(query['SessionID'] == null) res.status(200).send({success: false, message: "Parameter tidak lengkap"});
    else cctvControllers.getallcctv(query).then(function (result) {
        res.status(200).send(result);
    }).catch(function (err) {

    });
});

module.exports = router;