
var app = require('../app.js');

var request = require("request");

describe('app', function () {
  it('should return the collection name and a token', function (done) {

    var json = {
        "query": {
        "historical": {
          "q":"GWPH",
          "since":"2012-10-10",
          "until":"2014-01-01"
        },
        "collection":"GWPH_historical"
      }
    };
    request.post('http://localhost:3000/data.json', function(error, response, body){
      console.log("callback body")
      console.log(body);
    }).form(json);

  });
});