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
var timeout = express.timeout

app.use(timeout(60000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

server.listen(port);
app.set('views', __dirname + '/views');

QueryIssuer = require('./query_issuer.js');

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

function earlyRoute(route, fn) {
  app.get(route + ".json", function(req, res){
    console.log("early-route-callback");
    res.write(route);
    res.end();
  });
  fn(route);
}
  function fileComplete(route) {
    app.get(route + ".json", function(req, res){
      console.log("late-route-callback");
      res.render("query/" + route + ".json");
    });
  }

function constructRoute(route, result) {
  console.log("Route trying to be constructed");
  console.log(route);
  fs.writeFile("query/" + route + ".json", JSON.stringify(result), function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
      fileComplete(route);
  });
}

var functions = {
  query: function (args, callback) {
    console.log("in query funct")
    try {
      var opts = {};
      if (args.hasOwnProperty("version")) {
        opts["version"] = args["version"];
        delete args["version"];
      };
      console.log("issuing query");
      console.log(args) ;
      console.log(opts);
      console.log(earlyRoute);
      console.log(constructRoute);
      console.log(callback);
      QueryIssuer.issueQuery(args, opts, earlyRoute, constructRoute, callback);
    } catch (err) {
      callback({'error': err.toString()})
    }
  }
}

app.post('/data.json', function (req, res) {
  var args = req.body;
  console.log(args);
  for (var key in args) {
    console.log(key);
    console.log(functions[key]);
    functions[key](args[key], function(arg) {
      var nextJson = { "status" : 200, "route" : arg};
      console.log(nextJson);
      res.write(JSON.stringify(nextJson));
      res.end();
    });
  }
});

app.post('/query.json', function(req, res) {
  var json_data = req.body;
  inspect(json_data);
  QueryIssuer.issueQuery(json_data, {}, function () {},   function () {}, function(arg) {
    res.write(arg);
    res.end();
  });
});

db.ensureIndex()
