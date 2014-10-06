var request = require('request'),
QueryIssuer = require('../query_issuer.js')
MongoClient = require('../util/mongo_client.js');
/*
Timer = function (name, args, interval, limits, startValue) {
  _this = this; 
  _this.name = name; 
  _this.args = args; 
  _this.interval = interval; 
  _this.job = function (data, callback) {
    callback(data); 
  }
  _this.value = startValue; 

  if (limits.hasOwnProperty("max")) {
    _this.max = limits["max"]; 
  } else {
    _this.max = null; 
  }

  if (limits.hasOwnProperty("min")) {
    _this.min = limits["max"]; 
  } else {
    _this.min = null; 
  }
}

Timer.prototype.timerFunction = function () {
  var start = this.interval; 
  _this.job(); 
}

Timer.prototype.start = function () {
  this.timerId = setTimeout(this.timerFunction, this.interval); 
}

Timer.prototype.abort = function () {
  clearInterval(_this.timerId); 
}

Timer.prototype.setJob = function (options) {
  
  args = { "search": { "q": 'GWPH' }, "collection":"GWPH_current"};

  this.job(function (sendValue) {
    options["calculate_value"](_this, sendValue);
  }, function (sendValue) {
    options["job"](_this, function (value) {
    var interval; 
    if (value > _this.value) interval = _this.interval / 2; 
    else if (value < _this.value) interval = _this.interval * 2; 
    else interval = _this.interval; 
    if (_this.max !== null) 
      if (interval > _this.max) interval = _this.max; 
    if (_this.min !== null) 
      if (interval < _this.min) interval = _this.min; 
    _this.value = value; 
    _this.interval = interval; 
  }); 
}
 
var options = { 
  calculateValue: (function (_this, sendValue) {
    MongoClient.getDocumentCount(_this.args["collection"], function (c) {
      var count = c; 
      QueryIssuer.issueQuery(args, function (response) {
        MongoClient.insertAndReturnMong(response["data"], _this.collectionName, 
        function (messageToClient, callback) {
          callback(); 
        }, 
        function (number) {
          sendValue(number - count);  
        }); 
      }); 
    }); 
  });
}

TimerList = function () {
  this.timers = {}; 
}; 

TimerList.prototype.addTimer = function (timer) {
  this.timers[timer.name] = timer; 
}




function issueRequest() {

}

functi


function abortTimer() { // to be called when you want to stop the timer
  clearInterval(tid);
}

args = {
  "search": {
    "q": 'GWPH'
  },
  "collection":"GWPH_current"
}

QueryIssuer.issueQuery(args, function (response) {
  MongoClient.insertToDatabase(response["data"], "GWPH_current", function (messageToClient) {
      console.log(messageToClient); 
      console.log(Date.new())

*/