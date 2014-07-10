var mong = require('mongodb').MongoClient;
var dbName = "analytics";
var url = "mongodb://localhost:27017/" + dbName; 

module.exports = function (data, collectionName) {
	mong.connect(url, function(err, db) {
	  if(!err) {
	    console.log("We are connected");
	  }
	  console.log(collectionName); 
	  var collection = db.collection(collectionName);
	  collection.insert(data, {w:1}, function(err, result) {
	  	console.log(err);
	  });
	});
}


