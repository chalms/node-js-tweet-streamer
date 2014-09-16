var request = require('request'),
QueryIssuer = require('../query_issuer.js')

describe('QueryIssuer', function () {
  it ('it should return the currect query', function () {
    json = {
      "search": {
      "q": 'GWPH', //<----- this is the new query string
      "since": "2013-06-01" //<---- day-month-year
    //  "until": "2014-01-01",
      },
      "collection":"GWPH-tweets",
      "since_id": 12353, //<--- the id of another tweet
      "result_type": "popular" //<-- can also be recent or mixed
    }
    myVal = null;
    var kanye = QueryIssuer.issueQuery(json, function (result){
      console.log("issueQuery called!");
      myVal = result;
    })
    expect(myVal).toBe("200");
  });
});