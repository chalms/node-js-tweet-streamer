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

function haltOnTimedout(req, res, next) { 
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

// main documentation (http server) ---> 
app.get('/', function(req, res){
  res.render('index', {title: 'Twitter Streamer'});
});

// twitter query builder ----> 
app.post('/query.json', function (req, res) {
  log.requestBody(req); 
  var args = req.body;
  QueryIssuer.issueQuery(args, function (response) {
    log.queryResponse(response); 
    if (typeof response === 'object') {
      if (response.hasOwnProperty("data")) {
        MongoClient.insertToDatabase(response["data"], args["collection"], function (messageToClient) {
          res.write(messageToClient); 
          res.end(); 
        }); 
      } else if (response.hasOwnProperty("error")) {
        log.queryError(response["error"]); 
        res.write(JSON.stringify({ "status":400})); 
        res.end(); 
      } else if (response.hasOwnProperty("status")) {
        res.write(JSON.stringify({ "status": response["status"] })); 
        res.end(); 
      } else {
        console.log("Response did not have the right keys: "); 
        console.log(response); 
      }
    } else {
      console.log("Response was not an object: "); 
      console.log(response); 
    }
  }); 
});


/*

app.post('/query.json', function(req, res) {
  log.requestBody(req);
  var data = req.body;
  QueryIssuer.issueQuery(data, function(arg) {
    res.write(arg);
    res.end();
  });
});


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
*/
