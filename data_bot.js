var fs = require('fs');
var request = require('request');
var QueryIssuer = require('./query_issuer.js');
var MongoClient = require('./util/mongo_client.js');
var log = require('./util/log.js');

module.exports = function (interval, limits, startValue, name) {
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
  this._this.setBotInterval(interval);
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
  _this = this;

  _this.abort = function () {
    log.aborting();
    _this.blocked = false;
    clearInterval(_this.timerId);
    MongoClient.setRunning('current_data_aggregator', false, function (result) {
      console.log(result);
    });
  }

  _this.startJob = function (query, collectionName) {
    log.startingBot(query, collectionName);
    _this.blocked = true;
    _this.args["search"]["q"] = query;
    _this.args["collection"] = collectionName;
    console.log(_this.args);
    _this.collectionName = collectionName;
    _this.calculateValue(function (interval) {
      log.adjustingInterval(interval);
      if (this.blocked) {
        _this.setBotInterval(interval);
        clearInterval(_this.timerId);
        setTimeout(_this.timerFunction, _this.interval);
      } else {
        log.intervalAdjustmentFailed();
        _this.abort();
      }
    });
  }

  _this.setInterval = function(value) {
    if (value === null || value === undefined || (String typeof value)) return;
    _this.interval = value;
  }

  _this.setNewInterval = function (value, callback) {
    var interval;
    console.log("THIS IS THE VALUE: ");
    console.log(value);
    if (value > _this.value) {
      console.log("INTERVAL DIVIDED BY 2") ;
      _this.setBotInterval(_this.interval / 2);
    } else if (value < _this.value) {
        console.log("INTERVAL TIMES 2") ;
      _this.setBotInterval(_this.interval * 2);
    } else {
      console.log("NEW INTERVAL");
      _this.setBotInterval(_this.interval);
    }

    console.log("THIS IS THE INTERVAL: ");
    console.log(interval);

    console.log("THIS IS THE OLD INTERVAL: ");
    console.log(_this.interval);

    if (_this.max !== null) {
      if (interval > _this.max) { _this.setBotInterval(_this.max);
      }
    }
    if (_this.min !== null) {
      if (interval < _this.min) {
        _this.setBotInterval(_this.min);
      }
    }

    _this.value = value;
    _this._this.setBotInterval(interval);

    console.log("CALLING BACK WITH: ");
    console.log(_this.interval);
    callback(_this.interval);
  }

  _this.calculateValue = function (callback) {
    log.queryAndCollectionName(_this.args, _this.collectionName);
    var magArgs = _this.args;
    var setNewIntervalFunct = _this.setNewInterval;
    MongoClient.getDocumentCount(_this.collectionName, function (c) {
      var count = c;
      log.newDocumentCount(c);
      console.log(magArgs);
      QueryIssuer.issueQuery(magArgs, function (response) {
        log.issueQueryResponse(magArgs);
        function insertQuery(data, callback) {
          if( (Object.prototype.toString.call( data ) === '[object Array]') || (data instanceof Array) ) {
            for (var i = 0; i < data.length; i++) {
              data[i]["query"] = magArgs["search"]["q"];
            }
          } else {
            data["query"] = magArgs["search"]["q"];
          }
          callback(data);
        }
        insertQuery(response["data"], function (data){
          log.issueQueryCallbackData(data);
          MongoClient.insertAndReturnMong(data, _this.collectionName,
          function (messageToClient, cback) {
            cback();
          },
          function (number) {
            log.writeNumberAndCount(number, count);
            var diff = number - count;
            if (diff === 0) {
              _this.ongoingCount += 1;
              if (_this.ongoingCount > 2) {
                _this.abort();
              }
            } else {
              setNewIntervalFunct(diff, callback);
            }
          });
        });
      });
    });
  }

  console.log("_THIS.INTERVAL");
  console.log(_this.interval);
  console.log("THIS.INTERVAL");
}
