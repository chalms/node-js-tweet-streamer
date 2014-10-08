var request = require('request'),
QueryIssuer = require('../query_issuer.js')
MongoClient = require('../util/mongo_client.js');

Timer = function (interval, limits, startValue) {
  this.blocked = false; 
  this.args = {
    "search": {
      "q": ''
    },
    "collection":''
  }
  this.defaultLimits = {
    min: 10000, 
    max: 600000
  }
  this.interval = interval; 
  this.value = startValue; 
  if (limits.hasOwnProperty("max")) {
    this.max = limits["max"]; 
  } else {
    this.max = this.defaultLimits.max; 
  }
  if (limits.hasOwnProperty("min")) {
    this.min = limits["max"]; 
  } else {
    this.min = this.defaultLimits.min; 
  }
  this.ongoingCount = 0; 
}

Timer.prototype.abort = function () {
  this.blocked = false; 
  clearInterval(this.timerId);
  MongoClient.updateElement('current_data_aggregator', this.args, this.collectionName); 
}

Timer.prototype.adjustInterval = function (interval){
  if (this.blocked) {
    this.interval = interval; 
    clearInterval(this.timerId);
    setTimeout(this.timerFunction, this.interval);
  }
}

Timer.prototype.startJob = function (query, collectionName) {
  this.blocked = true; 
  this.args = query; 
  this.collectionName = collectionName; 
  this.calculateValue(this.adjustInterval);
}

Timer.prototype.setNewInterval = function (value, callback) {
  var interval; 
  if (value > this.value) interval = this.interval / 2; 
  else if (value < this.value) interval = this.interval * 2; 
  else interval = this.interval; 
  if (this.max !== null) 
    if (interval > this.max) interval = this.max; 
  if (this.min !== null) 
    if (interval < this.min) interval = this.min; 
  this.value = value; 
  this.interval = interval; 
  callback(this.interval); 
}

Timer.prototype.calculateValue = function (callback) {
  _this = this; 
  MongoClient.getDocumentCount(this.collectionName, function (c) {
    var count = c; 
    QueryIssuer.issueQuery(_this.args, function (response) {
      MongoClient.insertAndReturnMong(response["data"], _this.collectionName, 
      function (messageToClient, cback) {
        cback(); 
      }, 
      function (number) {
        if ((number - count) === 0) {
          this.ongoingCount += 1; 
        } else {
          this.ongoingCount = 0; 
        }
        if (this.ongoingCount > 2) {
          this.abort(); 
        } else {
          this.setNewInterval(number - count, callback);   
        }
      });
    });
  });
}

