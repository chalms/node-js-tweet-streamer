var config = require('./config1.js');
var log = require('./log.js');
Twit = require('twit');
Stream = require('./stream.js');
mongoClient = require('./mongo_client.js')


TwitterStreamer = function() {
	this.T = new Twit(config);
} 

TwitterStreamer.prototype.search = function (query, storageCollection) {
	this.T.get('search/tweets', { q: query, count: 100 }, function(err, data, response) {
	  console.log(data);
	  mongoClient(data, storageCollection);
	})
}

TwitterStreamer.prototype.stream = function (keywords) {
	this.stream = new Stream(this, keywords);
}


module.exports = TwitterStreamer;