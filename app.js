var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var formatter = require('./util/formatter.js');
var log = require('./util/log.js');
net = require('net');
QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');
log.wipe();

function inspect(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null}));
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
  log.write(err.stack);
});

var clients = {};

net.createServer(function (socket) {
  writeToSocket = function (tweets) {
    if (tweets) {
      if (socket) {
        socket.write(tweets);
      } else {
        console.log("no socket");
        return;
      }
    } else {
      socket.write("no tweets found");
    }
    removeSock(socket);
  }

  function addSock(sock) {
    var name = (String)(sock.remoteAddress + ":" + sock.remotePort);
    clients[name] = sock;
  }

  function removeSock(sock) {
    var name = (String)(sock.remoteAddress + ":" + sock.remotePort);
    if (clients[name]) {
      clients[name].end();
    }
  }

  this.socket = socket;
  addSock(this.socket);
  _this = this;

  function issueQuery(args, writeToSocket) {
    var collectionName = args["collection"];
    if (!collectionName) {
      _this.socket.write("no collection name given");
      _this.socket.end();
    }
    var twitter = new TwitterStreamer(collectionName);
    var queryBuilder = new QueryBuilder();
    var searchParams = queryBuilder.buildSearch(args["search"]);
    if (searchParams) twitter.search(searchParams, writeToSocket)
    // var streamParams = queryBuilder.buildStream(args["stream"]);
    // if (streamParams) twitter.stream(streamParams, writeToSocket);
  }

  this.socket.on('data', function(data) {
    log.write(data);
    var json_data = JSON.parse(data);
    inspect(json_data);
    issueQuery(json_data, writeToSocket);
  });

  this.socket.on('end', function () {
    removeSock(socket)
  });
}).listen(3000);
