var express = require('express');
var app = express();
var fs = require('fs');
var util = require('util');
var formatter = require('./util/formatter.js');
var log = require('./util/log.js');
var net = require('net');
var sys = require('sys');
var http = require('http');
var bodyParser = require('body-parser');

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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(express.bodyParser());
app.get('/', function(req, res){
  res.render('index', {title: 'Twitter Streamer'});
});


function inspect(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null}));
}

function issueQuery(args, fn) {
  var collectionName = args["collection"];
  if (!collectionName) return "no collection name given";
  var twitter = new TwitterStreamer(collectionName);
  var queryBuilder = new QueryBuilder();
  var searchParams = queryBuilder.buildSearch(args["search"]);
  if (searchParams) {
    var result = "55";
    var k = twitter.search(searchParams, function (r) {
      result = r;
      fn(JSON.stringify(result));
      return;
    });
  }
}

app.post('/query.json', function(req, res) {
  var json_data = req.body;
  inspect(json_data);
  issueQuery(json_data, function(arg) {
    res.write(arg);
    res.end();
  });
});

