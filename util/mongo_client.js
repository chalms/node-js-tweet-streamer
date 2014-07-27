var mong = require('mongodb').MongoClient;
var url = "";

module.exports = function(data, result, fn) {
	mong.connect(url, function(err, db) {
	  if(!err) {
	    console.log("We are connected");
	  }
	  console.log(collectionName);
	  var collection;
	  try {
	   collection = db.collection(collectionName);
	   collection.count();
	  } catch (err) {
	  	log.write(err);
	  	db.createCollection(collectionName)
	  	collection = db.collection(collectionName);
	  }

	  console.log(data);
	  collection.insert(data, {w:1}, function(err, result) {
	  	if (!err) {
	  		console.log(result);
	  		fn(result);
	  	} else {
	  		console.log(err);
	  	}
	  });
	});
};