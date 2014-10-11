var request = require('request'),
QueryIssuer = require('../query_issuer.js')
MongoClient = require('../util/mongo_client.js');

describe('QueryIssuer', function () {
  it ('it should run a simple current query', function (done) {
    args = {
      "search": {
        "q": 'GWPH'
      },
      "collection":"GWPH_test"
    }
    QueryIssuer.issueQuery(args, function (response) {
      MongoClient.insertToDatabase(response["data"], "GWPH_test", function (messageToClient) {
        console.log("inserted");
        expect(messageToClient["status"]).toEqual(200);
        done();
      });
    });
  });
});

describe('QueryIssuer', function () {
  it ('it should run a simple current query', function (done) {
    args = {
      "search": {
        "q": 'GWPH'
      },
      "collection":"GWPH_test"
    }
    MongoClient.getDocumentCount(args["collection"], function (c) {
      var count = c;
      QueryIssuer.issueQuery(args, function (response) {
        console.log("Response received!");
        MongoClient.insertAndReturnMong(response["data"], "GWPH_test",
        function (messageToClient, callback) {
          expect(messageToClient["status"]).toEqual(200);
          callback();
        },
        function (number) {
          console.log(number + " <- number, count -> " + count);
          expect(number).toNotEqual(count);
          done();
        });
      });
    });
  });
});


describe('QueryIssuer', function () {
  it ('it should run a simple current query', function (done) {
    MongoClient.getMinAndMaxValues("GWPH_test", function (min, max) {
      expect(min < max).toBe(true);
      done();
    });
  });
});

describe('QueryIssuer', function () {
  xit ('it should run historical queries using the streamer', function (done) {
    args = {
      "search" : {
        "q":"GWPH",
        "since":"2013-06-01",
        "until":"2014-03-01"
      },
      "collection":"GWPH_test"
    }
    QueryIssuer.issueQuery(args, function (response) {
      log.queryResponse(response);
      MongoClient.insertToDatabase(response["data"], "GWPH_test", function (messageToClient) {
        expect(messageToClient).toContain("status");
        expect(messageToClient["status"]).toEqual(200)
        done();
      });
    });
  });
});


describe('QueryIssuer', function () {
  xit ('it should allow user queries by screen name', function (done) {
    args = {
      "user" : {
        "screen_name": "offportal"
      },
      "collection" : "twitter_users_test"
    }
    MongoClient.getDocumentCount("twitter_users_test", function (count, m) {
     // m.close();
      QueryIssuer.issueQuery(args, function (response) {
        log.queryResponse(response);
        MongoClient.insertAndReturnMong(response["data"], args["collection"],
        function (messageToClient, callback) {
          expect(messageToClient).toContain("status");
          expect(messageToClient["status"]).toEqual(200);
          callback();
        },
        function (collection, mong) {
          expect(collection.count()).toEqual(count+1);
        //  mong.close();
          done();
        });
      });
    });
  });
});

describe('QueryIssuer', function () {
  xit ('it should run historical queries using the scraper', function (done) {
    args = {
      "historical" : {
        "q":"GWPH",
        "since":"2013-06-01",
        "until":"2014-03-01"
      }, "collection" : "GWPH_test"
    }
    QueryIssuer.issueQuery(args, function (response) {
      log.queryResponse(response);
      MongoClient.insertToDatabase(response["data"],  "GWPH_test", function (messageToClient) {
        expect(messageToClient).toContain("status");
        expect(messageToClient["status"]).toEqual(200)
        done();
      });
    });
  });
});

describe('QueryIssuer', function () {
  xit ('it should run using the streamer', function (done) {
    args = {
      "stream" : {
        "track":"GWPH"
      }, "collection" : "GWPH_test"
    }
    QueryIssuer.issueQuery(args, function (response) {
      log.queryResponse(response);
      MongoClient.insertToDatabase(response["data"], "GWPH_test", function (messageToClient) {
        expect(messageToClient).toContain("status");
        expect(messageToClient["status"]).toEqual(200);
        done();
      })
    });
  });
});
