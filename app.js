var express = require('express');
var app = express();
var fs = require('fs');
var util = require('util');
var formatter = require('./util/formatter.js');
var log = require('./util/log.js');
var net = require('net');
var sys = require('sys');
var http = require('http');
// var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var server = http.createServer(app);

server.listen(port);
app.set('views', __dirname + '/views');
QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');
log.wipe();
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log.write(err.stack);
});
// app.use(express.bodyParser());
app.get('/', function(req, res){
  res.render('index', {title: 'Twitter Streamer'});
});

function inspect(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null}));
}


function issueQuery(args, writeToSocket) {
  var collectionName = args["collection"];
  if (!collectionName) return "no collection name given";
  var twitter = new TwitterStreamer(collectionName);
  var queryBuilder = new QueryBuilder();
  var searchParams = queryBuilder.buildSearch(args["search"]);
  if (searchParams) {
    result = twitter.search(searchParams);
    if (!result) { return "500"; } else {
      result = (result.typeof === String) ? result : result.toString();
    }
    if (!result) { return "500"; } else { return "200"; }
  } else {
    return "500";
  }
}

function stubData (request) {
  inspect(request);
  hash = {
    "params":{
      "collection": "plugPowerQ",
      "search": {
        "q": "PLUG OR Plug power",
        "request_type": "recent"
      }
    }
  }
  return hash;
}

app.post('/query.json', function(request, response) {
  // app.use(  bodyParser );
  var data = stubData(request)
  // responseBody();
  log.write(data);
  var json_data = JSON.parse(data);
  inspect(json_data);
  return issueQuery(json_data["params"]);
});
