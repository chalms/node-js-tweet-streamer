QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');
Record = require('./util/record.js');
Historical = require('./historical.js');
UserData = require('./user_data.js');
mongoClient = require('./util/mongo_client.js');
finish = require('finish');
var log = require('./util/log.js');

exports.issueQuery = function (args, dataHandler) {
  var flag = true;
  var collectionName = args["collection"];
  if (!collectionName) return "no collection name given";

  functions = {
    historical: function(data) {
      Historical.launch(data, collectionName, dataHandler) ;
    },
    user: function (data) {
      UserData.show(data, collectionName, dataHandler) ;
    },
    stream: function (data) {

    },
    search: function (data) {

      var twitter = new TwitterStreamer(collectionName);
      var queryBuilder = new QueryBuilder();
      queryBuilder.buildSearch(data, function (searchParams) {
        console.log("Searching for: ");
        console.log(searchParams);
        twitter.search(searchParams, function (result) {
          console.log("Data handler: ");
          console.log(result);
          dataHandler(result);
        });
      });
    }
  };

  // search through all keys for the functions we want to run
  // and there are no functions, try to run a standard search

  finish(function(async) {
    for (var key in args) {
      async(function (done) {
        if (functions.hasOwnProperty(key)) {
          functions[key](args[key]);
          flag = false;
        }
      });
    }
  }, function(err, results) {
    console.log("No search param entered!");
    if (flag && args.hasOwnProperty("q")) functions["search"](args["q"]);
  });
}
