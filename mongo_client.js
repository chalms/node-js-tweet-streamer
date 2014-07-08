var mong = require('mongodb').MongoClient;
var dbName = "analytics";
var url = "mongodb://localhost:27017/" + dbName; 

module.exports = function (data, collectionName) {
	mong.connect(url, function(err, db) {
	  if(!err) {
	    console.log("We are connected");
	  }
	  console.log ("collection name to follow"); 
	  console.log(collectionName); 
	  var collection = db.collection(collectionName);
	  console.log(collection.toString());
	  collection.insert(data, {w:1}, function(err, result) {
	  	
	  	console.log("error v");
	  	console.log(err);
	  	console.log("result v");
	  	console.log(result);
	  });
	});
}


