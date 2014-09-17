var config = require('./util/config1.js');
var log = require('./util/log.js');
mongoClient = require('./util/mongo_client.js');
Twit = require('twit');
Record = require('./util/record.js');

exports.show = function (jsonStr, collection, otherFn) {
  _this = this;
  _this.collection = collection;
  _this.biggerCallback = otherFn;
  _this.T = new Twit(config);
  _this.T.get('users/show', jsonStr, function(err, data, response) {
    console.log("Tweet return data");
    console.log(data);
    mongoClient(data, _this.collection, function (data_result) {
        console.log("the mongo data result is below ");
        console.log(data_result);
        if (data_result) {
          _this.biggerCallback("{ status: 200}");
        }
        return;
      });
  });
}