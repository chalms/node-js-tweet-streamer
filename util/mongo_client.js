var mong = require('mongodb').MongoClient;
var log = require('./log.js');
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";
var finish = require('finish');
var request = require('request');
var colors = require('colors');
var Twit = require('twit');
var config1 = require('./config1.js');

exports.createCollection = function (db, collectionName, callback) {
  var collection;
  try {
    collection = db.collection(collectionName);
  } catch (e) {
    log.errorGettingCollection();
    db.createCollection(collectionName);
    collection = db.collection(collectionName);
  }
  function createSparseUniqueIndex(params, coll, callback) {
    coll.ensureIndex(params, { sparse: true, unique: true}, function (err, name) {
      if (err) {
        console.log("ERROR CREATING INDEX".red);
      } else {
        console.log("NEW INDEX CREATED".green);
        callback(coll);
      }
    });
  }
  createSparseUniqueIndex({ "id" : 1}, collection, function (collectioN) {
    createSparseUniqueIndex({ "url" : 1}, collectioN, function (collectiON) {
      createSparseUniqueIndex({ "id_str" : 1}, collectiON, function (collectION) {
        callback(collectION);
      });
    });
  });
}

exports.createUserDatabase = function (db, collectionName, callback) {
  var collection;
  try {
    collection = db.collection(collectionName);
  } catch (e) {
    log.errorGettingCollection();
    db.createCollection(collectionName);
    collection = db.collection(collectionName);
  }
  function createSparseUniqueIndex(params, coll, callback) {
    coll.ensureIndex(params, { sparse: true, unique: true}, function (err, name) {
      if (err) {
        console.log("ERROR CREATING INDEX".red);
      } else {
        console.log("NEW INDEX CREATED".green);
        callback(coll);
      }
    });
  }
  createSparseUniqueIndex({ "id" : 1}, collection, function (collectiON) {
    createSparseUniqueIndex({ "id_str" : 1}, collectiON, function (collectION) {
      callback(collectION);
    });
  });
}


exports.loadUserDataForTweetCollection = function (collectionName, callback) {
  var _ref = this;
  var twit = new Twit(config1);
  mong.connect(url, function(err, db) {

    var statusCollection;
    try {
      statusCollection = db.collection(collectionName);
    } catch (err) {
      callback(err, null);
    }
    var backupCollection;
    try {
      backupCollection = db.collection('user_info_test');
    } catch (err) {
      callback(err, null);
    }
    _ref.items = [];
    var cursor;


    function clearBatch(it, items, callback) {
      if(it === null) {
        log.batchCleared();
      } else {
        callback(it, items);
      }
    }

    function processItem(err, itemObj) {
      clearBatch(itemObj, _ref.items, function (item, items) {
        console.log("RIGHT BEFORE IN CALLBACK".blue);
        console.log("RIGHT AFTER IN CALLBACK".blue);
        _ref.items = items;
        if (item) {
          if (item.hasOwnProperty('user')) {
            var id = null;
            if (item.user.hasOwnProperty('id')) {
              id = item.user.id
            } else if (item.user.hasOwnProperty('id_str')) {
              id = item.user.id_str;
            }
            if (id !== null) {
              twit.get('users/show',
              {
                "user_id":id
              }, function (err, reply, json) {
                if (!err) {
                  if (typeof reply === "string") {
                    reply = JSON.parse(reply);
                  }
                  var elem = reply;
                  var collection = _ref.collection ? _ref.collection : backupCollection;
                  collection.update({
                      $or: [ {
                        "id": elem["id"]
                      }, {
                        "id_str": elem["id_str"]
                      } ]
                    },
                    {
                      $set: elem
                    },
                    {
                      upsert: true,
                      safe: false
                    }, function (err,data) {
                      if (err){
                        console.log(err);
                      }else{
                        console.log("No errors data set");
                      }
                    }
                  );
                } else {
                  console.log(err);
                }
                cursor.nextObject(processItem);
              });
            }
          }
        }
      });
    };

    _ref.createUserDatabase(db, 'user_info_test', function (col) {
      _ref.collection = col;
      cursor = statusCollection.find();
      cursor.nextObject(processItem);
    });
  });
};

exports.getMinAndMaxValues = function (collectionName, args, callback){
  _this = this;
  _this.collectionName = collectionName;
  _this.callback = callback;
  log.checkingMinMaxArgs(args);
  mong.connect(url, function(err, db) {
    _this.createCollection(db, _this.collectionName, function (collection) {
      _this.collection = collection;
      _this.collection.findOne({"query": args["q"]}, { "sort": [['id','desc']] }, function (err, max) {
        _this.collection.findOne({"query": args["q"]}, { "sort": [['id','asc']] }, function (err, min) {
          if (min && max) {
            callback(min.id, max.id);
          } else {
            callback(null, null);
          }
        });
      });
    });
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

exports.insertAndReturnMong = function(data, collectionName, ref, callbackFunction) {
  _this = this;
  _this.callbackFunction = callbackFunction;
  _this.collectionName = collectionName;

  mong.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      _this.callbackFunction(null, ref);
      return;
    }
    try {
      _this.collection = db.collection(_this.collectionName);
    } catch (err) {
      console.log(err);
      _this.callbackFunction(null, ref);
      return;
    }
    _this.callMe = function(r) {
      log.callMeCallbackCalled();
      _this.collection.count(function (err, count) {
        _this.callbackFunction(count, r);
      });
    }

    try {
      var bulk = _this.collection.initializeUnorderedBulkOp();
      if (data.length > 0) {
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
            console.log("In insert and return mong");
            throw err
          } else {
            _this.callMe(ref);
          }
        });
      } else {
        console.log("Skipping bulk execution and calling callback");
        _this.callMe(ref);
      }
    } catch (err) {
      console.log(err);
      _this.callMe(ref);
    }
  });
}

exports.getCollectionView = function (callback) {
  var keys = ['system.indexes', 'system.users', 'objectlabs-system', 'objectlabs-system', 'admin.collections'];
  mong.connect(url, function(err, db) {
    db.collections(function (err, collections) {
      if (err) {
        callback(err, collections);
      } else {
        var errors = [];
        var collectionData = {};
        try {
          finish(function(async) {
            for (var i in collections) {
              async(function (done) {
                var collection = collections[i];
                if (keys.indexOf(collection.collectionName) === -1) {
                  collectionData[collection.collectionName] = {};
                  collectionData[collection.collectionName]['name'] = collection.collectionName;
                  collection.count(function (err, count) {
                    if (err) {
                      errors.push(err);
                    } else {
                      collectionData[collection.collectionName]['count'] = count;
                    }
                  });
                  collection.indexInformation(function (err, indexes) {
                    if (err) {
                      errors.push(err);
                    } else {
                      collectionData[collection.collectionName]['indexes'] = indexes;
                    }
                    done();
                  });
                } else {
                  done();
                }
              });
            }
          }, function (err, data) {
            callback(errors, collectionData);
          });
        } catch (err) {
          callback(err, collections);
        }
      }
    });
  });
}

exports.getDocumentCount = function (collectionName, bool, callback) {
  log.getDocumentCountStart(collectionName);
  this.callback = callback;
  this.collectionName = collectionName;
  _this = this;
  mong.connect(url, function(err, db) {
    if (bool) {
      _this.createCollection(db, _this.collectionName, function (collection) {
        _this.collection = collection;
        _this.collection.count(function (err, count) {
          _this.callback(count);
        });
      });
    } else {
      _this.collection = db.collection(collectionName);
      _this.collection.count(function (err, count) {
        _this.callback(count);
      });
    }
  });
}


exports.getData = function(data, collectionName, callbackGetData) {
	mong.connect(url, function(err, db) {
	  if(err) {
	  	throw err;
	  }
    collection = db.collection('collectionName');
    collection.insert(data, {w: 1}, function(err, result) {
      if (!err) {
        var d = JSON.stringify(result);
        log.callbackOnSoloInsertion(d, callbackGetData);
        callbackGetData(d);
      } else {
        log.insertionError(err)
      }
    });
	});
}

exports.getDataBot = function(data, collectionNm, callbackGetDataBot) {
  mong.connect(url, function(err, db) {
    if(err) {
      throw err;
    }
    collection = db.collection('collectionName');
    collection.insert(data, {w: 1}, function(err, result) {
      if (!err) {
        var d = JSON.stringify(result);
        log.callbackOnSoloInsertion(d, callbackGetDataBot);
        callbackGetDataBot(d);
      } else {
        log.insertionError(err)
      }
    });
  });
}
