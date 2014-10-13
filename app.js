var express = require('express');
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
    console.log(data);

    var str = "";
    var keySet = [];

    for (var k in data) {
      keySet.push(k);
    }

    console.log("KEY SET".red);
    console.log(keySet);
    try {
      function runLoop(key) {
        console.log("RUN LOOP");
        console.log(key);
        var j = data[key];
        if (typeof j === 'object') {
          inspect.inspect(j, function (d) {
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
          });
        } else {
          if (key[key.length-1] === ':') {
            key = key.substring(0, key.length - 1);
          }
          str = str + key + " , " + j + "\n";
          if (keySet.length > 0) {
            runLoop(keySet.pop());
          } else {
            console.log(keySet.length);
            callback(str);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (keySet.length > 0) {
      var key = keySet.pop();
      console.log("RUNNING RUN LOOP".red);
      console.log(key);
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

        console.log(colors.cyan(key));
        key = firstKey.replace(/[\W_]+/g,"");


        console.log(colors.cyan(key));
        console.log(colors.cyan(key));

        if (value === 'object') {
          runLoop(value, function (result) {
            data[key] = result;
            keySet.splice(index, 1);
            if (keySet.length === 0) {
              callback(data);
            }
          });
        } else {
          data[key] = value;
          keySet.splice(index, 1);
          if (keySet.length === 0) {
            callback(data);
          }
        }
      }
    }
    runLoop(data, function (result) {
      callback(js2xmlparser("doc", result));
    })
  }
}
app.post('/finance/:server/:job/:ticker', function (req, res) {
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
    if (str !== null) {
      if (formatter.hasOwnProperty(str)) {
        formatter[str](data, function (result) {
          res.write(result);
          res.end();
        });
      } else {
        console.log("FORMATTER DOES NOT HAVE X".cyan);
        formatter["html"](data, function (result) {
            res.write(result);
            res.end();
        });
      }
    }
  }, function (data) {
    if (!data.hasOwnProperty("error")) {
      MongoClient.saveStockData(req.params.id, req.params.job, data);
    }
  });
});

app.get('/finance/:server/:job/:ticker', function (req, res) {
  var request_args = {
    server: req.params.server,
    job: req.params.job,
    ticker: req.params.ticker.split('.')[0]
  }
  var str = req.url.split(/[\/\.]+/)[5];
  servers[request_args['server']].request(request_args, function (data) {
    if (str !== null) {
      if (formatter.hasOwnProperty(str)) {
        formatter[str](data, function (result) {
          res.write(result);
          res.end();
        });
      } else {
        console.log("FORMATTER DOES NOT HAVE X".cyan);
        formatter["html"](data, function (result) {
            res.write(result);
            res.end();
        });
      }
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

function launchDataAggregator(req, res, writeResponseFunct) {
  var collectionName = req.body.hasOwnProperty("collectionName") ? req.body["collectionName"] : 'GWPH_test' ;
  var query = req.body.hasOwnProperty("query") ? req.body["query"] : 'GWPH';
  MongoClient.setNewQuery('current_data_aggregator',
    collectionName,
    query,
    function (result, writeResponseFunct) {
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


// var WebSocketServer = WebSocket.Server, wss = new WebSocketServer({port: app.get('port')});
// wss.on('connection', function(webS) {
//   webS.on('message', function(message) {
//     MongoClient.runQuery(message, function (result) {
//       webS.send(JSON.stringify(result));
//     });
//   });
// });


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
