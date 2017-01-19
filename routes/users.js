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

router.post('/signup', function(req, res, next) {
  console.log(req.body);
  var email = req.body.Email;
  var phonenumber = req.body.Phonenumber;
  var gender = req.body.Gender;
  var birthday = req.body.Birthday;
  var password = req.body.Password;
  var name = req.body.Name;
  if(email == null || phonenumber == null || gender == null || birthday == null || password == null || name == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userModel.regsiter(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});


router.post('/getprofile', function(req, res, next) {
  var sessid = req.body.SessionID;
  if(sessid == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userModel.getProfile(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});


router.post('/getprofilebyid', function(req, res, next) {
  var sessid = req.body.SessionID;
  var userid = req.body.UserID;
  if(sessid == null || userid == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userModel.getProfileById(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});


module.exports = router;
