var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var timeout = require('connect-timeout');
var path = require('path');
var fs = require('fs');
var util = require('util');
var formatter = require('./util/formatter.js');
var log = require('./util/log.js');
var MongoClient = require('./util/mongo_client.js');
var DataBot = require('./data_bot.js');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.use(timeout(60000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}


QueryIssuer = require('./query_issuer.js');
log.wipe();
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log.write(err.stack);
});


var timers = {};

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

function launchDataAggregator(req, res, writeResponseFunct) {
  console.log("calling set new query");
  var collectionName = req.body.hasOwnProperty("collectionName") ? req.body["collectionName"] : 'GWPH_test' ;
  var query = req.body.hasOwnProperty("query") ? req.body["query"] : 'GWPH';
  MongoClient.setNewQuery('current_data_aggregator',
    collectionName,
    query,
    function (result, writeResponseFunct) {
      console.log(result);
      console.log("in mongo client callback");
      if (timers.hasOwnProperty('current_data_aggregator')) {
        timers['current_data_aggregator'].startJob(result["query"], result["collection"])
      } else {
        timers['current_data_aggregator'] = new DataBot(10000, 5000, 10, 'current_data_aggregator');
        timers['current_data_aggregator'].startJob(result["query"], result["collection"]);
      }
      writeResponseFunct(result);
    },
    writeResponseFunct
  );
}

// // main documentation (http server) --->


app.post('/current_timer.json', function (req, res) {
  try {
    if ((req.body.hasOwnProperty("query")) && (req.body.hasOwnProperty("collectionName"))) {
      launchDataAggregator(req, res, function (result) {
          result["status"] = 200;
          res.write(JSON.stringify(result));
          res.end();
      });
    } else {
      req.write(JSON.stringify({"status":400}));
      req.end();
    }
  } catch (err) {
    console.log(err);
    req.write(JSON.stringify({"status":400}));
  }
});



app.get('/', function(req, res) {
  launchDataAggregator(req, res, function (result) {
  console.log("in launch data aggregator callback -> write response funct");
  console.log(result);
  res.render('index', { title: "Data bot"}, function (err, html) {
    res.send(html);
  });
  });
});

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



  // console.log("calling large data aggregator");


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
