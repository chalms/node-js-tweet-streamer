var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var fs = require('fs');
var util = require('util');
var colors = require('colors');
var formatter = require('./util/formatter.js');
var log = require('./util/log.js');
var MongoClient = require('./db/mongo.js');
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
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));
app.use(timeout(60000));
app.use(haltOnTimedout);


function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

log.wipe();
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log.write(err.stack);
});


app.use('/', require('./services/router.js'));

function getCollection(name, p) {
  mongo.connect(url, function(err, db) {
    if (err) {
      throw err;
    } else {
      var collection;
      function e(ev, callback) {
        try {
          collection = db.collection(name);
          ev(collection);
        } catch (err) {
          callback(ev);
        }
      };
      e( function (collection) {
          if (collection === null || collection === undefined) {
            throw (new Error("Cannot make collection!"));
          } else {
            p(collection);
          }
        }, function (ev) {
          try {
            collection = db.createCollection(name);
            ev(collection);
          } catch (er) {
            throw (new Error(er));
          }
      });
    }
  });
}

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  var twitter = new Twit(config);

  // when the client emits 'new message', this listens and executes
  socket.on('query', function (data) {

    var jsonData = JSON.parse(data);
    console.log(JSON.stringify(jsonData).cyan);
    var collection, query, twitJson;

    function testError(resp) {
      try {
        if (resp.predicate) {
            resp.success();
        } else {
            throw resp.failMsg;
        }
      } catch (err) {
        resp.failure(err.message);
      }
    }

    testError({
      predicate: data.hasOwnProperty("collection"),
      failMsg: "Error Creating Collection!",
      success: function () {
        getCollection(data["collection"], function (err, data) {
          collection = data;
          next(collection);
        });
      },
      failure: function (failureString) {
         emit('error', { username: socket.username, error: failureString, status: 400});
      },
      next: function (val) {
        testError(val);
      }
    });

    function getQuery(callback) {
      try {
        if (data.hasOwnProperty("search")) {
          query = data["search"];
          twitJsonObject = { q: query };
        } else {
          throw "Has no property 'Search'";
        }

      } catch (err) {
        emit('error', { username: socket.username, error: err.getMessage, status: 400});
      }
    }

    _this.twitter.get('search/tweets', twitJsonObject, function (err, tweets, serverResponseData) {

         console.log(("Sending Query: " + query).green);

        try {

          if (err !== null && err !== undefined) {

              console.log(err);

              emit('error', { username: socket.username, error: "The API did not respond!", status: 400 });

          } throw "The API did not respond!";
        } catch (err) {
                  {
              emit('tweets', { username: socket.username, status: 200, data: tweets });
          }
        }
    });

    checkCollection(function (collection) {
      checkFunction(function (search) {

      });
    });




    _this = this;

    var query = queryParams.query;
    console.log(colors.cyan(query));

    function emit(msg, json) {
      socket.broadcast.emit(msg, json);
    }

    twitJsonObject = { q: query }; // <-- the json args


  });
});

//   // when the client emits 'add user', this listens and executes
//   socket.on('add user', function (username) {
//     // we store the username in the socket session for this client
//     socket.username = username;
//     // add the client's username to the global list
//     usernames[username] = username;
//     ++numUsers;
//     addedUser = true;
//     socket.emit('login', {
//       numUsers: numUsers
//     });
//     // echo globally (all clients) that a person has connected
//     socket.broadcast.emit('user joined', {
//       username: socket.username,
//       numUsers: numUsers
//     });
//   });

//   // when the client emits 'typing', we broadcast it to others
//   socket.on('typing', function () {
//     socket.broadcast.emit('typing', {
//       username: socket.username
//     });
//   });

//   // when the client emits 'stop typing', we broadcast it to others
//   socket.on('stop typing', function () {
//     socket.broadcast.emit('stop typing', {
//       username: socket.username
//     });
//   });

//   // when the user disconnects.. perform this
//   socket.on('disconnect', function () {
//     // remove the username from global usernames list
//     if (addedUser) {
//       delete usernames[socket.username];
//       --numUsers;

//       // echo globally that this client has left
//       socket.broadcast.emit('user left', {
//         username: socket.username,
//         numUsers: numUsers
//       });
//     }
//   });
// });


// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
