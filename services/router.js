// var defaultSend = require('./send.js');
// var defaultSave = require('./save.js');
var express = require('express');
var router = express.Router();
var route = require('./route.js');


router.post("/:service/:job", function (req, res, next) {
  var tail = req.params.job.split('.');
  var retVal = (tail.length > 0) ? tail[1] : 'html';
  var d = (tail.length > 0) ? tail[0] : tail;
  route("post", retVal, d, d, function () {
    next();
  });
});

router.get("/:service/:job/:args", function (req, res, next) {
  console.log(req.service)
  route("get", req, res, function () {
    next();
  });
});

module.exports = router;