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



module.exports = router;