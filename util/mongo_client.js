var mong = require('mongodb').MongoClient;
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";

module.exports = function (data, collectionName, funct) {
	function callMe() {
		funct("200");
	}
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
	  console.log("that was the data");
	  collection.insert(data, {w:1}, function(err, result) {
	  	if (!err) {
	  		console.log(result);
	  		callMe();
	  	} else {
	  		console.log(err);
	  	}
	  });
	});
}