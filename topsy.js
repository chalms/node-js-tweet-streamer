var request = require('request');
var phantom = require('phantom');
var formatter = require('./util/formatter.js');
var cheerio = require('cheerio');
var mongoClient = require('./util/mongo_client.js');
var finish = require("finish");
var log = require('./util/log.js')

exports.launch = function (jsonStr,  collection, fn) {
  console.log("topsy launched");
  _this = this;
  _this.collection = collection;
  _this.fn = fn;

  function buildUrl() {
    console.log("buildURl Called");
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

  function passBackStack(data, fn) {
     console.log("passBackStack called");
    var jsonStack = [];
    finish(function(async) { 
      while(data.length > 0) {
        async(function(done) { 
          var str = "https://api.twitter.com/1/statuses/oembed.json?id=";
          var idString = data.pop().split("/status/")[1];
          var newUrl = str + idString;
          console.log("accessing " + newUrl); 
          request(newUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
              var theJSON = JSON.parse(html);
              console.log("pushing to jsonStack"); 
              jsonStack.push(theJSON);
            }
          });
        });
      }
    }, function(err, results) {
      console.log("finished, calling jsonStack")
      fn({ "data": jsonStack });
    });   
  }

  function runIt(stack) {
    passBackStack(stack, function (passedStack) {
      mongoClient.getData(passedStack, _this.collection, _this.fn);
    });
  }

  var stack = [];
  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open(buildUrl(), function(status) {
        log.openSite(status); 
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
              runIt(result);
              ph.exit();
            });
          }, 5000);
        });
      });
    });
  });
}

