var mong = require('mongodb').MongoClient;

//var url = "mongodb://localhost:3000/tweets";
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";

var crypt = require('crypto');


exports.getEarlyRoute = function (collectionName, returnEarly, fn, returnTokenCallback) {

	mong.connect(url, function(err, db) {
		if (err) throw err;
		var collection = db.collection("country");

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


exports.getData = function(data, collectionName, fn) {
	mong.connect(url, function(err, db) {
	  if(err) {
	  	throw err;
	  }
	  console.log(collectionName);
	  var collection;
	  try {
	 // console.log("trying to get collection");
	  	collection = db.collection(collectionName);
	  	console.log(collection);
	  } catch (err) {
	 		console.log("error getting collection");
	  	db.createCollection(collectionName)
//	 	console.log("trying to get collection again")
	  	collection = db.collection(collectionName);
	  }
	  	console.log("~~~~~ test counting the number of items in the collection ~~~~~");
		console.log(collection);
	  collection.insert(data, {w: 1}, function(err, result) {
	  	if (!err) {
	  		console.log("no error found");
	  		fn(result);
	  		return result;
	  	} else {
	  		console.log("~~~~~~ insertion error below~~~~~")
	  		console.log(err);
	  	}
	  });
	});
}
