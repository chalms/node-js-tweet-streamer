var mong = require('mongodb').MongoClient;
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";

module.exports = function(data, collectionName, fn) {
	mong.connect(url, function(err, db) {
	  if(!err) {
	    console.log("We are connected");
	  } else {
	  	console.log(err);
	  }
	  console.log(collectionName);
	  var collection;

	  try {
	 // 	console.log("trying to get collection");
	   collection = db.collection(collectionName);
	 //  console.log("trying to count collection");
	   collection.count();
	  } catch (err) {
	 // 	console.log("error getting collection");
	  	db.createCollection(collectionName)
	 // 	console.log("trying to get collection again")
	  	collection = db.collection(collectionName);
	  }
	  // console.log("~~~~~ test counting the number of items in the collection ~~~~~");
	  // console.log(collection.count());
	 // console.log("maybe got the collection?");
	 // console.log(collection);
	 // console.log("the above is the collection");
	  // console.log("~~~~~~below is the data to insert~~~~~~~");
	 	// console.log(data);
	  collection.insert(data, {w:1}, function(err, result) {
	  	if (!err) {
	  		fn(result);
	  		return result;
	  	} else {
	  		console.log("~~~~~~ insertion error below~~~~~")
	  		console.log(err);
	  	}
	  });
	});
};