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
var jade = require("jade");
var jf = require('jsonfile')
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


var serverRoute = './services/manifest.json'
var manifest = jf.readFileSync(serverRoute));

var formatter =

app.post('services/:server/:job/:args', function (req, res) {

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

app.get('services/:server/:job/:args', function (req, res) {

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
