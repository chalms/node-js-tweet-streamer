var mong = require('mongodb').MongoClient;

var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";

exports.getMinAndMaxValues = function (collectionName, callback){
  _this = this;
  _this.collectionName = collectionName;
  _this.callback = callback;
   mong.connect(url, function(err, db) {
    if (err) {
      throw err;
      return;
    } else {
      _this.collection = db.collection(collectionName);
      var options = { "sort": [['id','desc']] };
      _this.collection.findOne({}, options, function (err, max) {
        options = { "sort": [['id','asc']] };
        _this.collection.findOne({}, options, function (err, min) {
          console.log(min.id);
          callback(min.id, max.id);
        });
      });
    }
  });
}

exports.setNewQuery = function (dataAggregator, collectionName, query, callback, writeResponseFunct) {
  _this = this;
  console.log("in set new query");
  mong.connect(url, function(err, db) {
    console.log("in monfo ");
    var collection;
    if (err) {
      console.log("error connecting to mongo");
      callback({"status" : 400}, writeResponseFunct);
    } else {
      try {
        collection = db.collection('data_bots');
      } catch (e) {
        collection = db.createCollection('data_bots');
      }
      var bulk = collection.initializeUnorderedBulkOp();
      bulk.find({"name": dataAggregator }).upsert().updateOne({ $set: {
        "name" : dataAggregator,
        "query" : query,
        "running" : true,
        "collection"  : collectionName
        }
      });
      bulk.execute(function(err, result) {
        if (err) {
          throw err
        } else {
          console.log("bundle executed!");
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

exports.updateElement = function (dataAggregator, collectionName, query, callback) {
   mong.connect(url, function(err, db) {
    var collection;
    if (err) {
      throw err;
      return;
    } else {
      collection = db.collection('data_bots');
      var bulk = collection.initializeUnorderedBulkOp();
      bulk.find({'name': dataAggregator }).upsert().updateOne({ $set: { "running" : false } });
      bulk.execute(function(err, result) {
        if (err) {
          throw err
        } else {
          callback(result);
        }
      });
    }
  });
}

/*
exports.getDatabot = function (dataBot) {
  mong.connect(url, function(err, db) {

}
*/


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
      console.log("callMe() called");
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
  console.log("getDocument Count");
  console.log(collectionName);
  this.callback = callback;
  this.collectionName = collectionName;
  _this = this;
  mong.connect(url, function(err, db) {
    if(err) {
      throw err;
    }
    try {
      console.log("Write before error");
      console.log(_this.collectionName);
      _this.collection = db.collection(_this.collectionName);

    } catch (err) {
      console.log("~~~error getting collection~~~~~~");
      console.log(_this.collectionName);
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
	 		console.log("error getting collection");
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

exports.getDataBot = function(data, collectionName, fn) {

  mong.connect(url, function(err, db) {
    if(err) {
      throw err;
    }
    try {
      collection = db.collection(collectionName);
    } catch (err) {
      console.log("error getting collection");
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



/*
var crypt = require('crypto');

exports.getEarlyRoute = function (collectionName, returnEarly, fn, returnTokenCallback) {

  mong.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection(collectionName);

    function getCount(val, callback) {
      val.count(function (err, count) {
        console.log(err);
        console.log("COUNT IN CALLBACK");
        var bool = false;
        if (count > 0) bool = true;
        callback(bool);
      });
    }

    getCount(collection, function (bool) {
      if (bool) {
        var token = crypt.randomBytes(64).toString('hex');
        var route = collectionName + '/' + token;
        returnEarly(route, fn);
        returnTokenCallback(token);
        return ;
      } else {
        var route = collectionName + '/';
        returnEarly(route, fn);
      }
    });
  });
}

exports.buildRoute = function (data, collectionName, token, constructRoute, fn) {

  mong.connect(url, function(err, db) {
    console.log("second mong connect");
    var jsonToInsert = {}, routeName = collectionName;
    if (token !== undefined && token !== null) {
      jsonToInsert[token] = data;
      routeName = routeName + "/" + token;
    } else {
      jsonToInsert = data;
    }
    console.log("about to insert into collection");

    var collection = db.collection(collectionName);

    console.log(collection);
    collection.insert(jsonToInsert, function (err, result) {
      if (!err) {
        console.log("no error - constructing route")
        constructRoute(routeName, result);
      } else {
        console.warn(err.message);
      }
    });
  });
}

*/
