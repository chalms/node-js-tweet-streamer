var config = require('./util/config1.js');
var log = require('./util/log.js');
mongoClient = require('./util/mongo_client.js');
Twit = require('twit');
Record = require('./util/record.js');

exports.show = function (requestedData, collection, dataCallback) {
  _this = this;
  _this.collection = collection;
  _this.dataCallback = dataCallback;
  _this.T = new Twit(config);
  _this.T.get('users/show', requestedData, function(err, data, response) {
    if (!err) {
      dataCallback({"data": data});
    } else {
      dataCallback({"error": err});
    }
  });
}