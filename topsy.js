var request = require('request');
var phantom = require('phantom');
var formatter = require('./util/formatter.js');
var cheerio = require('cheerio');


exports.launch = function (jsonStr, collection, otherFn) {
  _this = this;
  _this.collection = collection;
  _this.biggerCallback = otherFn;

  function buildUrl() {
    var query = jsonStr["q"];
     query = encodeURIComponent(query.trim());
     var offset = "";
     var timeString = "";
     var withTime = false;
     if (jsonStr["since"] !== undefined || jsonStr['since'] != null) {
        var value = parseInt((new Date(jsonStr['since'])).getTime()/1000);
        timeString = "&mintime=" + value;
        withTime = true;
     }
     if (jsonStr["until"] !== undefined || jsonStr['until'] != null) {
        var value = parseInt((new Date(jsonStr['until'])).getTime()/1000);
        if (withTime == false) {
          var nextDate = new Date();
          nextDate.setDate((new Date(jsonStr['until'])).getDate() - 365);
          timeString = "&mintime=" + parseInt(nextDate.getTime()/1000);
        }
        timeString = timeString + "&maxtime=" + value;
        withTime = true;
     }
     if (withTime) timeString = "%20" + timeString;
     return "http://topsy.com/s?q=" + query + timeString;
  }

  function passBackStack(data) {

    var jsonStack = [];
    while(data.length > 0) {
      var str = "https://api.twitter.com/1/statuses/oembed.json?id=";
      var idString = data.pop().split("/status/")[1];
      var newUrl = str + idString;
      request(newUrl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
          console.log(html);
          var theJSON = JSON.parse(html);
          console.log(theJSON);
          jsonStack.push(theJSON);
        }
      });
    }
    return jsonStack;
  }

  function runIt(fn) {
      mongoClient(fn(), _this.collection, function (data_result) {
      console.log("~~~~~~~~~~~ the mongo data result is below ~~~~~~~");
      console.log(data_result);
      if (data_result) {
        _this.biggerCallback("{ status: 200}");
      }
      return;
    });
  }

  var stack = [];
  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open(buildUrl(), function(status) {
        console.log("opened site? ", status);
              page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
                  setTimeout(function() {
                      return page.evaluate(function() {
                        var stack = [];
                        $('#results div .media .media-body .inline li small a').each(function () {
                            if (($(this).attr('href').indexOf("status") > -1) && ($(this).attr('href').indexOf("trackback") === -1)) {
                              stack.push($(this).attr('href'));
                            }
                          });
                          return stack;
                      }, function(result) {
                          console.log(result);
                          runIt(function () {
                            return passBackStack(result);
                          });
                          ph.exit();
                      });
                  }, 5000);

              });
          });
      });
  });

  console.log(phantom.state);
  console.log(stack);
}

