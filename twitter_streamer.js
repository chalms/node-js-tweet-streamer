var config = require('./config1.js');
var log = require('./log.js');
Twit = require('twit');
Stream = require('./stream.js');
mongoClient = require('./mongo_client.js')


TwitterStreamer = function() {
	this.T = new Twit(config);
} 

TwitterStreamer.prototype.search = function (query, storageCollection, socket, callback) {
  this.callback = callback; 
  _this = this; 
  console.log("about to search for tweets");
	this.T.get('search/tweets', { q: query, count: 100 }, function(err, data, response) {
    mongoClient(data, storageCollection);
    console.log("stored data");
    _this.callback(socket, data);
	});
}

TwitterStreamer.prototype.stream = function (keywords) {
	this.stream = new Stream(this, keywords);
}


module.exports = TwitterStreamer;