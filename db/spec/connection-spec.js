var mongo = require('../db/connection.js');

var collection = (mongo.connectSync(function (db) { return db.collection('docs'); } ));
console.log("collection one!");
console.log(collection_2);
var collection_2 = mongo.connectSync(function (db) { collection_2 = db.collection('articles'); } );
console.log("collection two!");
console.log(collection_2);
var collection_3;
mongo.connectSync(function (db) { collection_3 = db.collection('articles'); } );
console.log("collection three!");
console.log(collection_3);