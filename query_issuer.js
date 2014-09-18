QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');
Record = require('./util/record.js');
Topsy = require('./topsy.js');
UserData = require('./user_data.js');
mongoClient = require('./util/mongo_client.js');

exports.issueQuery = function (args, options, earlyRoute, constructRoute, fn) {
  console.log("Query Issued: ");
  console.log(args);
  var collectionName = args["collection"];
  if (!collectionName) return "no collection name given";
  if (args.hasOwnProperty("topsy")) {
    console.log("args has topsy")
    if (options.hasOwnProperty("version")) {
      console.log("opts has version -> launching topsy");
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
  } else if (args["user"] !== undefined && args["user"] !== null) {
      UserData.show(args["user"], collectionName, fn);
  } else {
    var twitter = new TwitterStreamer(collectionName);
    var queryBuilder = new QueryBuilder();
    var searchParams = queryBuilder.buildSearch(args["search"]);
    if (searchParams) {
      var result = "";
      console.log("launching search");
      var k = twitter.search(searchParams, function (r) {
        result = r;
        fn(JSON.stringify(result));
        return;
      });
    } else {
      // console.log("No search parameters!")
    }
  }
}
