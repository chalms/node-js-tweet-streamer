var request = require('request'),
QueryIssuer = require('../query_issuer.js')

describe('QueryIssuer', function () {
  xit ('it should return the currect query', function () {
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
      console.log(result);
    })
    expect(myVal).toBe("200");
  });
});

describe('QueryIssuer', function () {
  it ('it should run historical queries using the webscraper', function () {
     json = {
      "topsy" : {
      "q":"John OR Sandy",
      "since":"2014-01-01",
      "until":"2014-03-01"
      },
      "collection":"GWPH-tweets"
    }
    var myVal;
    var kanye = QueryIssuer.issueQuery(json, function (result){
      console.log("issueQuery called!");
      myVal = result;
      console.log(result);
      return result;
    })
    expect(kanye).toBe("200");
    expect(myVal).toBe("200");
  });
});
