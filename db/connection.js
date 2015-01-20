var mongo = require('mongodb').MongoClient;
var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";
var Q = require('q');
module.exports = {
  url: url,
  connectWithQ: function (name) {
    console.log(name);
    var deferred = Q.defer();
    mongo.connect(url, function(err, db) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        var collection;
        function e(ev, callback) {
          try {
            collection = db.collection(name);
            ev(collection);
          } catch (err) {
            callback(ev);
          }
        }
        e( function (collection) {
          if (collection === null || collection === undefined) {
            deferred.reject(new Error("Cannot make collection!"));
          } else {
            deferred.resolve(collection);
          }
        }, function (ev) {
          try {
            collection = db.createCollection(name);
            ev(collection);
          } catch (er) {
              deferred.reject(new Error(er));
          }
        });
      }
    });
  return deferred.promise;
  },
  connect: function (name, p) {
    mongo.connect(url, function(err, db) {
      if (err) {
        throw err;
      } else {
        var collection;
        function e(ev, callback) {
          try {
            collection = db.collection(name);
            ev(collection);
          } catch (err) {
            callback(ev);
          }
        }
        e( function (collection) {
          if (collection === null || collection === undefined) {
            throw (new Error("Cannot make collection!"));
          } else {
            p(collection);
          }
        }, function (ev) {
          try {
            collection = db.createCollection(name);
            ev(collection);
          } catch (er) {
            throw (new Error(er));
          }
        });
      }
    });
  },
}