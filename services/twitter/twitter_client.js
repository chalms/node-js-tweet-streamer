var MongoClient = '../mongo_client.js';
exports.request = function(req, sendDataCallback, saveDataCallback) {
  var functions = {
    current_data: function(req, responseFunction) {
      var collectionName = req.body["collectionName"] ;
      var query = req.body["query"] ;
      var botName = 'current_data_aggregator';
      MongoClient.setNewQuery(botName,
        collectionName,
        query,
        function (result, sendDataCallback, saveDataCallback) {
          if (!timers.hasOwnProperty(botName)) {
             timers[botName] = new DataBot(10000, 5000, 10, botName);
          }
          timers[botName].startJob(query, collection);
          sendDataCallback(result);
        },
        saveDataCallback
      );
    },

  }
  functions[req.params.job](req, sendDataCallback, saveDataCallback)
}






// var WebSocketServer = WebSocket.Server, wss = new WebSocketServer({port: app.get('port')});
// wss.on('connection', function(webS) {
//   webS.on('message', function(message) {
//     MongoClient.runQuery(message, function (result) {
//       webS.send(JSON.stringify(result));
//     });
//   });
// });