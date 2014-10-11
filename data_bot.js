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

  var _this = this;

  _this.abort = function (_this) {
    log.aborting();
    _this.blocked = false;
    _this.aborted = true;
    MongoClient.setRunning('current_data_aggregator', false, function (result) {
      console.log(result);
    });
  }

  _this.runLoop = function (_this) {
    log.adjustingInterval(interval);
    if (_this.blocked) {
      _this.calculateValue(_this, _this.runLoop);
    } else {
      log.intervalAdjustmentFailed();
      if (!_this.aborted) {
        _this.abort(_this);
      }
    }
  };

  _this.startJob = function (query, collectionName) {
    log.startingBot(query, collectionName);
    _this.blocked = true;
    _this.firstRun = false;
    _this.args["search"]["q"] = query;
    _this.args["collection"] = collectionName;
    _this.collectionName = collectionName;
    _this.aborted = false;
    _this.runLoop(_this);
  }

  _this.insertQuery = function(data, queryParams, callback) {
    if( (Object.prototype.toString.call( data ) === '[object Array]') || (data instanceof Array) ) {
      for (var i = 0; i < data.length; i++) {
        data[i]["query"] = queryParams["search"]["q"];
      }
    } else {
      data["query"] = queryParams["search"]["q"];
    }
    callback(data);
  }

  _this.calculateValue = function (_this, callback) {
    log.queryAndCollectionName(_this.args, _this.collectionName);

    var queryParams = _this.args;
    var setNewIntervalFunct = _this.setNewInterval;
    var referenceThis = _this;
    var bool = _this.firstRun;


    MongoClient.getDocumentCount(_this.collectionName, bool, function (c) {
      var count = c;
      log.newDocumentCount(c);
      console.log(queryParams);

      _this.firstRun = false;
      referenceThis.firstRun = false;
      bool = false;

      QueryIssuer.issueQuery(queryParams, function (response) {
        log.issueQueryResponse(queryParams);

        referenceThis.insertQuery(response["data"], queryParams, function (data){
          log.issueQueryCallbackData(data);

          MongoClient.insertAndReturnMong(data, _this.collectionName, referenceThis, function (number, ref) {
            log.writeNumberAndCount(number, count);
            if (number === null || number === undefined) {
              ref.abort(ref);
            } else {
              var diff = number - count;
              if (diff === 0) {
                ref.abort(ref);
              } else {
                callback(ref);
              }
            }
          });
        });
      });
    });
  }
}
