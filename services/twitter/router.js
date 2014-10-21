
var timers = {};
// twitter query builder

var get = {
    // // main documentation (http server) --->
  current_timer: function (params, sendCallback, saveCallback) {
    MongoClient.getElement('data_bots', 'current_data_aggregator', function (item) {
      saveCallback(item);
      sendCallback(item);
    });
  },

  query: function (params, sendCallback, saveCallback) {

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
          res.write(
            JSON.stringify({ "status": response["status"] });
          res.end();
        } else {
          log.responseHadWrongKeys(response);
        }
      } else {
        log.responseNotObject(response);
      }
    });
  }
}

var post = {
  current_timer: function (params, sendCallback, saveCallback) {
    MongoClient.setRunning('current_data_aggregator', true, function (result) {
        saveCallback(result);
        sendCallback(result);
    });
  },

  user_info: function (params, sendCallback, saveCallback) {
    try {
      var collectionName = req.body["collection"];
      MongoClient.loadUserDataForTweetCollection(collectionName,
  }
}