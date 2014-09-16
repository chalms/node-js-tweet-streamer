QueryBuilder = require('./query_builder.js');
TwitterStreamer = require('./twitter_streamer.js');
Record = require('./util/record.js');
Topsy = require('./topsy.js');

exports.issueQuery = function (args, fn) {
  console.log("Query Issued: ");
  console.log(args);
  var collectionName = args["collection"];
  if (!collectionName) return "no collection name given";
  var twitter = new TwitterStreamer(collectionName);
  if (args["topsy"] !== undefined || args["topsy"] !== null) {
    Topsy.launch(args["topsy"]);
  } else {
    var queryBuilder = new QueryBuilder();
    var searchParams = queryBuilder.buildSearch(args["search"]);
    if (searchParams) {
      var result = "";
      console.log("~~~~~~searching for params below~~~~~~");
      console.log(searchParams);
      var k = twitter.search(searchParams, function (r) {
        console.log("~~~~~~~~~~~~search result is below~~~~~~~~");
        console.log(r);
        result = r;
        fn(JSON.stringify(result));
        return;
      });
    } else {
      console.log("No search parameters!")
    }
  }
}
