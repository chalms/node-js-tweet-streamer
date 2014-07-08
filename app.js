var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var formatter = require('./formatter.js');
var log = require('./log.js');

Server = require('./server.js')
QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log(err.stack);
});

function issueQuery(args, socket, callback) {
  console.log(args);
  search = args['search'];
  if (search) { 
    var q = new QueryBuilder();
    var collectionName = args['collectionName'] 
    q.args = search; 
    q = q.build(); 
    var twitter = new TwitterStreamer(); 
    twitter.search(q, collectionName, socket, callback); 
  }
} 


function classic() {
  function addArgs(q) {
  	return q.build(); 
  }
  var q = new QueryBuilder(); 
  q = addArgs(function(q) {

  	q.add("GWPH");
    q.addOr("gwph ");
    q.addOr(" gwph");
    q.addPositiveAttitude(); 
    q.addAfterDate(Date.new - 300); 
    q.addBeforeDate(Date.new - 100);
    // q.addNegativeAttitude(); 
    // q.addLinkFilter(); 
    // q.addSource(); 
  	return q;
  });
  var twitter = new TwitterStreamer();
  twitter.search(q, "CollectionName");
}

var server = new Server(issueQuery);