var mongo = require('mongodb').MongoClient;

module.exports = {
  url: "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets",
  connect: function (callback) {
    mongo.connect("mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets", function(err, db) {
      if (err) {
        throw err;
      }
      callback(db);
    });
  },
  connectSync: function (callback) {
    return mongo.connect("mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets", function(err, db) {
      if (err) {
        throw err;
      }
      return callback(db);
    });
  },
}