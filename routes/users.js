var express = require('express');
var router = express.Router();
var userController = require('../controller/user_controller');



router.post('/login', function(req, res, next) {
  console.log(req.body);
  if(req.body['Password'] == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userController.login(req.body, function (err, result) {
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
  var username = req.body.Username;
  var gender = req.body.Gender;
  var birthday = req.body.Birthday;
  var password = req.body.Password;
  var name = req.body.Name;
  if(username == null || gender == null || birthday == null || password == null || name == null) {
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

router.post('/signup-elang', function(req, res, next) {
  console.log(req.body);
  var username = req.body.Username;
  var gender = req.body.Gender;
  var birthday = req.body.Birthday;
  var password = req.body.Password;
  var name = req.body.Name;
  if(username == null || gender == null || birthday == null || password == null || name == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userController.signupElangApp(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});

router.post('/signup-notifier', function(req, res, next) {
    console.log(req.body);
    var username = req.body.Username;
    var gender = req.body.Gender;
    var birthday = req.body.Birthday;
    var password = req.body.Password;
    var name = req.body.Name;
    if(username == null || gender == null || birthday == null || password == null || name == null) {
        res.status(200).send({success: false, message: "parameter tidak lengkap"});
    }else {
        userController.signupNotifier(req.body, function (err, result) {
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
    userController.getProfile(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});

router.post('/updatestatus', (req, res, next) => {
   if(req.body['SessionID'] === 'undefined' || req.body['Status'] === 'undefined'){
       res.status(200).send({success: false, message: "parameter tidak lengkap"});
   }else {
       userController.updateOnlineStatus(req.body).then(result => {
           res.status(200).send(result);
       }).catch(err => {
          console.log(err);
           res.status(200).send({success: false, message: "Server bermasalah"});
       });
   }
});

router.post('/getprofilebyid', function(req, res, next) {
  var sessid = req.body.SessionID;
  var userid = req.body.UserID;
  if(sessid == null || userid == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userController.getProfileById(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});



router.post('/search', function(req, res, next) {
  var sessid = req.body.SessionID;
  var key = req.body.Keyword;
  if(sessid == null || key == null) {
    res.status(200).send({success: false, message: "parameter tidak lengkap"});
  }else {
    userController.searchUser(req.body, function (err, result) {
      if(err){
        res.status(200).send({success: false, message: "Server bermasalah"});
      }else {
        res.status(200).send(result);
      }
    });
  }
});


module.exports = router;
