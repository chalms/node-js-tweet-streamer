var config = require('./util/config1.js');
var log = require('./util/log.js');
mongoClient = require('./util/mongo_client.js');
Twit = require('twit');
Record = require('./util/record.js');

var Transform = require('stream').Transform;
var parser = new Transform({ encoding: 'utf8'});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log.write(err.stack);
});

TwitterStreamer = function(collectionName) {
  log.twitStreamCreated(collectionName); 
	this.T = new Twit(config);
  this.collection = collectionName;
}

TwitterStreamer.prototype.returnStatus = function (data, callback) {
  if (data) {
    callback({ "status": 200}); 
  } else {
    callback({ "status": 400})
  }
}

TwitterStreamer.prototype.search = function(args, searchCallback) {
  log.searchArgs(args); 
  _this = this;
  _this.T.get('search/tweets', args, function(err, data, response) {
    if (err) {
      log.twitSearchError(err); 
    } else {
      log.twitSearchSuccess(data); 
      mongoClient.getData(data, _this.collection, function (data_result) {
        log.twitDataSaved(data_result); 
        _this.returnStatus(data_result, searchCallback); 
      });
    }
  });
}

TwitterStreamer.prototype.stream = function (args) {
  function assignValue(value, def){
    var assgn;
    if (args[value]) {
      var p = parseInt(args[value])
      if (!p) {
        if (p < 100) {
          assgn = 100;
        } else {
          assgn = p;
        }
      } else {
        assgn = def;
      }
    }
    delete args[value]
    return assgn;
  }

  this.timeLimit = assignValue(args["timeLimit"], (10 *1000));
  this.limit = assignValue(args["limit"], 100);
  this.stream = this.stream('statuses/filter', args);
  this.numberTweets = 0;

  _this = this;

  _this.stop = function () {
    _this.stream.stop();
  }

  _this.incrementCount = function () {
    _this.numberTweets++;
    if (_this.numberTweets > _this.limit) {
      clearTimeout(_this.timer);
      _this.stop();
    }
  }

  _this.timer = setTimeout(function(){
    _this.stop();
  }, _this.timeLimit);


  this.stream.on('tweet', function (tweet) {
    mongoClient(tweet, this.collection);
    _this.incrementCount();
  })

  this.stream.on('limit', function (limitMessage) {
    console.log(limitMessage);

  })

  this.stream.on('warning', function (warning) {
    console.log(warning);
  })

}

module.exports = TwitterStreamer;




