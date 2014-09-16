var request = require('request');
var phantom = require('phantom');
var formatter = require('./util/formatter.js');


exports.launch = function (jsonStr) {

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
    var stack = [];
    phantom.create(function (ph) {
      phantom.state = [];
      ph.createPage(function (page) {
        page.open(buildUrl(), function (status) {
          page.evaluate(function () {
            $('#results div .media .media-body .inline li small a').each(function () {
              if (($(this).attr('href').indexOf("status") > -1) && ($(this).attr('href').indexOf("trackback") === -1)) {
                phantom.state.push($(this).attr('href'));
                console.log("pushing!");
              }
            });
          });
          ph.exit();
        });
      });
    });

  console.log(phantom.state);
  console.log(stack);




  // request(buildUrl(), function(error, response, html){
  //   if(!error){
  //     var $ = cheerio.load(html);
  //     console.log(html);
  //     console.log($);
  //     $(document).ready(function () {
  //       console.log("READY!")
  //     });
  //   }
  // })
  //     var stack = [];
  //     $('#results div .media .media-body .inline li small a').each(function () {
  //       if (($(this).attr('href').indexOf("status") > -1) && ($(this).attr('href').indexOf("trackback") === -1)) {
  //         stack.push($(this).attr('href'));
  //       }
  //     })
  //     for (var i in stack) {
  //       console.log(stack[i]);
  //     }
  //     return stack;
  //   }
  // })
}

