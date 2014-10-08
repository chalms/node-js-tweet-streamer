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
          res.write(JSON.stringify(messageToClient)); 
          res.end(); 
        }); 
      } else if (response.hasOwnProperty("error")) {
        log.queryError(response["error"]); 
        res.write(JSON.stringify({ "status":400})); 
        res.end(); 
      } else if (response.hasOwnProperty("status")) {
        res.write(JSON.stringify({ "status": response["status"] })); 
        res.end(); 
      } else { log.responseHadWrongKeys(response);  }
    } else { 
      log.responseNotObject(response); 
    }
  }); 
});

var timers = {}; 
app.post('/current_timer.json', function (req, res) {
  try { 
    if ((req.body.hasOwnProperty("query")) && (req.body.hasOwnProperty("collectionName"))) {
      MongoClient.setNewQuery('current_data_aggregator', 
        req.body["query"], 
        req.body["collectionName"], 
        function (result) {
          if (timers.hasOwnProperty('current_data_aggregator')) {
            timers['current_data_aggregator']startJob(result["query"], result["collectionName"])
          } else {
            timers['current_data_aggregator'] = new Timer(); 
            timers['current_data_aggregator']startJob(result["query"], result["collectionName"]); 
          }
          result["status"] = 200; 
          req.write(JSON.stringify(result)); 
          req.end(); 
        }
      );
    } else {
      req.write(JSON.stringify({"status":400})); 
      req.end(); 
    }
  } catch (err) {
    console.log(err); 
    req.write(JSON.stringify({"status":400})); 
  }
}); 

app.get('/current_timer.json', function (req, res) {
  // TODO: 
  // Need to get params from request and pass them into 'getCurrentFeeder'
  // Then need to retreive docs and place them into view 
  MongoClient.getCurrentFeeder(req.params, function (obj) {
    // new View(obj); 
    // res.write(View); 
    // req.end()
  }
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
