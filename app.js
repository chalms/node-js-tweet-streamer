var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var fs = require('fs');
var util = require('util');
var colors = require('colors');
var formatter = require('./util/formatter.js');
var log = require('./util/log.js');
var MongoClient = require('/mongo_client.js');
var DataBot = require('./data_bot.js');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var colors = require('colors');
var WebSocket = require('ws');
var inspect = require('./util/inspect');
var js2xmlparser = require("js2xmlparser");
var jade = require("jade");
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.set('view engine', 'jade');

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


var servers = {
  yahoo: require('./finance/yahoo.js'),
  quandl: require('./finance/quandl.js')
}

var formatter = {
  html: function (data, callback) {
    var fn = jade.compileFile('./views/table.jade', {});
    var html = fn({data: data});
    callback(html);
  },

  csv: function (data, callback) {

    console.log("IN CSV FUNCTION".red);

    var str = "";
    var keySet = [];
    for (var k in data) keySet.push(k);

    try {
      function runLoop(key) {

        console.log("RUN LOOP");
        var j = data[key];

        function addStr(d, key) {
          if (key[key.length-1] === ':') {
            key = key.substring(0, key.length - 1);
          }

          str = str + key + " , " + d + "\n";

          if (keySet.length > 0) {
            runLoop(keySet.pop());
          } else {
            console.log(keySet.length);
            callback(str);
          }
        }
        (typeof j === 'object') {
          inspect.inspect(j, function (d) {
            addStr(d, key);
          });
        } else {
          addStr(j, k);
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (keySet.length > 0) {
      var key = keySet.pop();
      console.log("RUNNING RUN LOOP".red);
      runLoop(key);
    }
  },
  text: function (data, callback) {
    callback(JSON.stringify(data));
  },
  json: function (data, callback) {
    callback(JSON.stringify(data));
  },
  xml: function (data, callback) {

    function runLoop(data, callback) {

      var keySet = [];
      var keys = {};
      for (var k in data) {
        keySet.push(k);
      }

      while (keySet.length > 0) {

        var key = keySet[0];
        var firstKey = keySet[0];
        var value = data[firstKey];
        var index = keySet.indexOf(firstKey);

        delete data[key];

        key = firstKey.replace(/[\W_]+/g,"");

        function removeKeyFromSet(result, index, cb) {
          data[key] = result;
          keySet.splice(index, 1);
          if (keySet.length === 0) callback(data);
        }

        if (value === 'object') {
          runLoop(value, function (result) {
            removeKeyFromSet(result, index, function () {});
          });
        } else {
          removeKeyFromSet(result, index, function () {});
        }
      }
    }

    runLoop(data, function (result) {
      callback(js2xmlparser("doc", result));
    });
  }
}

app.post('/:server/:job/:args', function (req, res) {

  var request_args = {
    server: req.body.server,
    job: req.body.job,
    ticker: req.body.ticker.split('.')[0]
  }

  delete req.body['server'];
  delete req.body['job'];
  delete req.body['ticker'];

  var str = req.url.split(/[\/\.]+/)[5];

  servers[request_args['server']].request(request_args, function (data) {
    if (str === null)  str = "html";

    if (formatter.hasOwnProperty(str)) {
      formatter[str](data, function (result) {
        res.write(result);
        res.end();
      });
    } else {
      res.write({ error: "Bad Params!"});
      res.end();
    }
  }, function (data) {
    if (!data.hasOwnProperty("error")) {
      MongoClient.saveStockData(req.params.id, req.params.job, data);
    }
  });
});

app.get('/:server/:job/:args', function (req, res) {

  var request_args = {
    server: req.params.server,
    job: req.params.job,
    ticker: req.params.args.split('.')[0]
  }

  var str = req.url.split(/[\/\.]+/)[5];

  servers[request_args['server']].request(request_args, function (data) {

    if (str === null) str = "html";

    if (formatter.hasOwnProperty(str)) {
      formatter[str](data, function (result) {
        res.write(result);
        res.end();
      });
    } else {
      res.write({ error: "Bad Params!"});
      res.end();
    }
  }, function (data) {
    if (!data.hasOwnProperty("error")) {
      MongoClient.saveStockData(req.params.id, req.params.job, data);
    }
  });
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


app.post('/user_info.json', function (req, res) {
  try {
    var collectionName = req.body["collection"];
    MongoClient.loadUserDataForTweetCollection(collectionName, function (err, done) {
      if (err === null) {
        res.write(JSON.stringify({status: 200, count: done}));
        res.end();
      } else {
        res.write(JSON.stringify({status: 400, error: err}));
        res.end();
      }
    });
  } catch (err) {
    res.write(JSON.stringify({status: 400, error: err}));
    res.end();
    return;
  }
});

// // main documentation (http server) --->
app.get('/current_timer.json', function (req, res) {
  MongoClient.getElement('data_bots', 'current_data_aggregator', function (item) {
    res.write(JSON.stringify(item));
    res.end();
  });
});

app.post('/current_timer.json', function (req, res) {
  MongoClient.setRunning('current_data_aggregator', true, function (result) {
    result["status"] = 200;
    res.write(JSON.stringify(result));
    res.end();
    launchDataAggregator(req, res, function (result) {});
  });
});

var content;
// First I want to read the file
fs.readFile('public/markdown/documentation.markdown', "utf8", function read(err, data) {
  if (err) {
    throw err;
  }
  content = data;
  app.get('/', function(req, res) {
    MongoClient.getCollectionView(function(errors, data) {
      log.logCollectionView(errors, data);
      res.render('index', { title: "Data bot", collections: data, markdown_text: content }, function (err, html) {
        res.send(html);
      });
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
