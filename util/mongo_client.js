var mong = require('mongodb').MongoClient;
var log = require('./log.js');
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";

exports.getMinAndMaxValues = function (collectionName, args, callback){
  _this = this;
  _this.collectionName = collectionName;
  _this.callback = callback;
  log.checkingMinMaxArgs(args);
  mong.connect(url, function(err, db) {
    if (err) {
      throw err;
      return;
    } else {
      _this.collection = db.collection(collectionName);
      _this.collection.findOne({"query": args["q"]}, { "sort": [['id','desc']] }, function (err, max) {
        _this.collection.findOne({"query": args["q"]}, { "sort": [['id','asc']] }, function (err, min) {
          if (min && max) {
            callback(min.id, max.id);
          } else {
            callback(null, null);
          }
        });
      });
    }
  });
}

exports.getElement = function (collection, name, callback) {
  mong.connect(url, function(err, db) {
    var c = db.collection(collection);
    var cursor = c.find({ 'name' : name });
    cursor.nextObject(function (err, item) {
      callback(item);
    });
  });
}

exports.setNewQuery = function (dataAggregator, collectionName, query, callback, writeResponseFunct) {
  _this = this;
  log.inSetNewQuery();
  mong.connect(url, function(err, db) {
    var collection;
    if (err) {
      log.mongoConnectingError();
      callback({"status" : 400}, writeResponseFunct);
    } else {
      try {
        collection = db.collection('data_bots');
      } catch (e) {
        collection = db.createCollection('data_bots');
      }
      var bulk = collection.initializeUnorderedBulkOp();
      bulk.find({"name": dataAggregator }).upsert().updateOne({ $set: {
        "name" : collectionName,
        "query" : query,
        "running" : true,
        "collection"  : dataAggregator
        }
      });
      bulk.execute(function(err, result) {
        if (err) {
          throw err
        } else {
          log.bundleExecuted();
          var hash = {};
          hash["query"] = query;
          hash["name"] = dataAggregator;
          hash["collection"] = collectionName;
          console.log(hash);
          _this.args = query;
          _this.collectionName = collectionName;
          callback(hash, writeResponseFunct);
        }
      });
    }
  });
}

exports.setRunning = function (dataAggregator, running, callback) {
  mong.connect(url, function(err, db) {
    var collection;
    if (err) {
      throw err;
      return;
    } else {
      collection = db.collection('data_bots');
      var bulk = collection.initializeUnorderedBulkOp();
      bulk.find({'name': dataAggregator}).upsert().updateOne({ $set: { "running" : running } });
      bulk.execute(function(err, result) {
        if (err) {
          throw err
        } else {
          var cursor = collection.find({'name': 'current_data_aggregator'});
          cursor.nextObject(function(err, item) {
            callback(item);
          });
        }
      });
    }
  });
}

exports.insertToDatabase = function(data, collectionName, clientMessage) {
  mong.connect(url, function(err, db) {
    if (err) {
      clientMessage({"status":400});
      return;
    }
    try {
      collection = db.collection(collectionName);
    } catch (err) {
      clientMessage({"status":400});
      return;
    }
    try {
      var bulk = collection.initializeUnorderedBulkOp();
      for (var i in data) {
        var elem = data[i];
        bulk.find({
          $or: [ {
            "id": elem["id"]
          }, {
            "id_str": elem["id_str"]
          } ]
        }).upsert().updateOne({ $set: elem });
      }
      bulk.execute(function(err, result) {
        if (err) {
          throw err
        } else {
          clientMessage({"status":200});
        }
      });
    } catch (err) {
      console.log(err);
      clientMessage({"status":400});
    }
  });
}

exports.insertAndReturnMong = function(data, collectionName, clientMessageFunction, callbackFunction) {
  _this = this;
  _this.clientMessageFunction = clientMessageFunction;
  _this.callbackFunction = callbackFunction;
  _this.collectionName = collectionName;
  mong.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      _this.clientMessageFunction({"status":400}, function () {});
      return;
    }
    try {
      _this.collection = db.collection(_this.collectionName);
    } catch (err) {
      console.log(err);
      _this.clientMessageFunction({"status":400}, function () {});
      return;
    }
    _this.callMe = function() {
      log.callMeCallbackCalled();
      _this.collection.count(function (err, count) {
        _this.callbackFunction(count);
      });
    }
    try {
      var bulk = _this.collection.initializeUnorderedBulkOp();
      for (var i in data) {
        var elem = data[i];
        bulk.find({
          $or: [ {
            "id": elem["id"]
          }, {
            "id_str": elem["id_str"]
          } ]
        }).upsert().updateOne({ $set: elem });
      }
      bulk.execute(function(err, result) {
        if (err) {
          throw err
        } else {
          _this.clientMessageFunction({"status":200}, _this.callMe);
        }
      });
    } catch (err) {
      console.log(err);
      _this.clientMessageFunction({"status":400}, _this.callMe);
    }
  });
}

exports.getDocumentCount = function (collectionName, callback) {
  log.getDocumentCountStart(collectionName);
  this.callback = callback;
  this.collectionName = collectionName;
  _this = this;
  mong.connect(url, function(err, db) {
    if(err) {
      throw err;
    }
    try {
      _this.collection = db.collection(_this.collectionName);
      log.getDocumentCountWrite(_this.collectionName);
    } catch (err) {
      log.getDocumentCountError(_this.collectionName);
      throw err;
    }
    _this.collection.count(function (err, count) {
      _this.callback(count);
    });
  });
}

exports.getData = function(data, collectionName, fn) {
	mong.connect(url, function(err, db) {
	  if(err) {
	  	throw err;
	  }
	  try {
	  	collection = db.collection(collectionName);
	  } catch (err) {
      log.errorGettingCollection();
	  	db.createCollection(collectionName)
	  }
	  collection.insert(data, {w: 1}, function(err, result) {
	  	if (!err) {
        var resultString = JSON.stringify(result);
        log.callbackOnSoloInsertion(resultString, fn);
	  		fn(resultString);
	  	} else { log.insertionError(err)}
	  });
	});
}

exports.getDataBot = function(data, collectionName, fn) {
  mong.connect(url, function(err, db) {
    if(err) {
      throw err;
    }
    try {
      collection = db.collection(collectionName);
    } catch (err) {
      log.errorGettingCollection();
      db.createCollection(collectionName)
    }
    collection.insert(data, {w: 1}, function(err, result) {
      if (!err) {
        var d = JSON.stringify(result);
        log.callbackOnSoloInsertion(d, fn);
        fn(d);
      } else { log.insertionError(err)}
    });
  });
}
