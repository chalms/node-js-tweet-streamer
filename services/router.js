var fs = require('fs');
var jf = require('jsonfile');
var serviceList = js.readFileSync('./manifest.json');
var defaultSend = require('./send.js');
var defaultSave = require('./save.js');

var router = express.Router();



router.post("/:service/:job", function (req, res, next) {
  var tail = req.params.job.split('.');
  var retVal = (tail.length > 0) ? tail[1] : 'html';
  var d = (tail.length > 0) ? tail[0] : tail;
  route("post", retVal, d, d, function () {
    next();
  });
});

router.get("/:service/:job/:args", function (req, res, next) {
  var tail = req.params.args.split('.');
  var retVal = (tail.length > 0) ? tail[1] : 'html';
  var d = (tail.length > 0) ? tail[0] : tail;
  route("get", retVal, d, req.body, function () {
    next();
  });
});

module.exports = router;