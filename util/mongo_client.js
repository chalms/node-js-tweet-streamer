var mong = require('mongodb').MongoClient;
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";

module.exports = function(data, collectionName, fn) {

	mong.connect(url, function(err, db) {
		console.log(db)
	  if(!err) {
	    console.log("We are connected");
	  } else {
	  	console.log(err);
	  }
	  console.log(collectionName);
	  var collection;
	  try {
	   collection = db.collection(collectionName);
	   collection.count();
	  } catch (err) {
	  	db.createCollection(collectionName)
	  	collection = db.collection(collectionName);
	  }
	  collection.insert(data, {w:1}, function(err, result) {
	  	if (!err) {
	  		fn(result);
	  		return result;
	  	} else {
	  		console.log(err);
	  	}
	  });
	});
};