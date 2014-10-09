var fs = require('fs');
var request = require('request');
var QueryIssuer = require('./query_issuer.js');
var MongoClient = require('./util/mongo_client.js');

DataBot = function (interval, limits, startValue, name) {
  this.name = name;
  this.blocked = false;
  this.args = {
    "search": {
      "q": 'GWPH'
    },
    "collection":'GWPH_test'
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

DataBot.prototype.abort = function () {
  this.blocked = false;
  clearInterval(this.timerId);
  console.log("Abort Called!");
  MongoClient.updateElement('data_bots', this.args, this.name);
}

DataBot.prototype.adjustInterval = function (interval){
  console.log("Adjusting Interval: " + interval);
  if (this.blocked) {
    this.interval = interval;
    clearInterval(this.timerId);
    setTimeout(this.timerFunction, this.interval);
  } else {
    console.log("Interval cannot be adjusted");
  }
}

DataBot.prototype.startJob = function (query, collectionName) {
  console.log("Starting data bot with query: " + query + ", collectionName: " + collectionName);
  this.blocked = true;
  this.args["search"]["q"] = query;
  this.args["collection"] = collectionName;
  console.log(this.args);
  this.collectionName = collectionName;
  this.calculateValue(this.adjustInterval);
}

DataBot.prototype.setNewInterval = function (value, callback) {
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

DataBot.prototype.calculateValue = function (callback) {
  _this = this;
  console.log("in calculate value.\n _this.collectionName: ");
  console.log(_this.collectionName);
  console.log(_this.args);
  var magArgs = _this.args;
  var setNewIntervalFunct = this.setNewInterval;
  MongoClient.getDocumentCount(_this.collectionName, function (c) {
    var count = c;
    console.log("new document count found to be: " + c);
    console.log("issuing query with args: ");
    console.log(magArgs);
    QueryIssuer.issueQuery(magArgs, function (response) {
      console.log("issue query called with response: ");
      console.log(response);
      MongoClient.insertAndReturnMong(response["data"], _this.collectionName,
      function (messageToClient, cback) {
        cback();
      },
      function (number) {
        console.log("variation in ongoing count calculated");
        console.log("number calculated to be: " + number);
        if ((number - count) === 0) {
          _this.ongoingCount += 1;
        } else {
          _this.ongoingCount = 0;
        }
        if (_this.ongoingCount > 2) {
          _this.abort();
        } else {
          setNewIntervalFunct(number - count, callback);
        }
      });
    });
  });
}

module.exports = DataBot;
