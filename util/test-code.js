var Q = require('q');
var mongo = require('../db/connection.js');
var inspect = require('../util/inspect.js');
var collection = Q.nfapply(mongo.connectWithQ, "tweets");
console.log("Collection!");
console.log(collection);