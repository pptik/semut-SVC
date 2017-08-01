var express = require('express');
var router = express.Router();
var userController = require('../controller/user_elang_controller');



router.post('/signup', function(req, res, next) {
  console.log(req.body);
  var username = req.body.Username;
  var pass = req.body.Password;
  var name = req.body.Name;
  var jabatan = req.body.Jabatan;
  var satuan = req.body.Satuan
  if(username == null || jabatan == null || satuan == null || pass == null || name == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userController.signup(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});

module.exports = router;
