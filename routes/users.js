var express = require('express');
var router = express.Router();
var userModel = require('../models/users');



router.post('/login', function(req, res, next) {
  console.log(req.body);
  if(req.body['Email'] == null || req.body['Password'] == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
   // res.status(200).send()
    userModel.login(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});

module.exports = router;
