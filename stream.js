Twit = require('twit');

Stream = function (T, filter, storageCollection) {
	this.stream = T.stream('statuses/filter', { track: filter })

	this.stream.on('tweet', function (tweet) {
	  console.log(tweet)
	   mongoClient(tweet, storageCollection);
	})

	this.stream.on('limit', function (limitMessage) {
	  console.log(limitMessage);
	})


	this.stream.on('warning', function (warning) {
	  console.log(warning);
	})
}

module.exports = Stream;

