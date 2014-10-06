QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');
Record = require('./util/record.js');
Topsy = require('./topsy.js');
UserData = require('./user_data.js');
mongoClient = require('./util/mongo_client.js');

exports.issueQuery = function (args, options, earlyRoute, constructRoute, fn) {
  var collectionName = args["collection"];
  if (!collectionName) return "no collection name given";
  if (args.hasOwnProperty("topsy")) {
    if (options.hasOwnProperty("version")) {
      try {
        mongoClient.getEarlyRoute(collectionName, earlyRoute, fn, function (token) {
          Topsy.launch(args["topsy"], true, collectionName, token, constructRoute, fn);
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      Topsy.launch(args["topsy"], false, collectionName, earlyRoute, constructRoute, fn);
    }
  } else if (args.hasOwnProperty("user")) {
      UserData.show(args["user"], collectionName, fn);
  } else {
    var twitter = new TwitterStreamer(collectionName);
    var queryBuilder = new QueryBuilder();
    var searchParams = queryBuilder.buildSearch(args["search"]);
    if (searchParams) {
      var result = "";
      var k = twitter.search(searchParams, function (r) {
        result = r;
        fn(JSON.stringify(result));
        return;
      });
    }
  }
}
