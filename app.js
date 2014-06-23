var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var formatter = require('./formatter.js');
var log = require('./log.js');
QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log(err.stack);
});

function addArgs(q) {
	return q.build(); 
}

var q = new QueryBuilder(); 
q = addArgs(function(q) {
	q.add("find these words");
	return q; 
}); 
var twitter = new TwitterStreamer(); 
twitter.search(q, "CollectionName");
