var request = require('request'),
Topsy = require('../topsy.js')

describe('Topsy', function () {
  it ('it should return the correct stack', function () {
    // http://topsy.com/s?q=John%20OR%20Sandy&mintime=1388541601&maxtime=1393639201
    json = {
      "q":"GWPH",
      "since":"2014-01-01",
      "until":"2014-03-01"
      }

    outputLinks = ["http://twitter.com/Yahoo/status/425127302733656064", "http://twitter.com/CNN/status/422694719680827392", "http://twitter.com/Yahoo/status/421795726822092802", "http://twitter.com/msnbc/status/425363652674588672", "http://twitter.com/lilduval/status/428521075274551296", "http://twitter.com/manugavassi/status/430283695493513216", "http://twitter.com/nytimes/status/436602509210447872", "http://twitter.com/HugoGloss/status/433846184160296960", "http://twitter.com/nytimes/status/422867945476616192", "http://twitter.com/HuffingtonPost/status/428706901640359937"];
    function done(data) {
      console.log(data);
    }
    expect(Topsy.launch(json, "", done)).toEqual(outputLinks);
  });
});