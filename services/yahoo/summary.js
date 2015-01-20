var request     = require('request');
var cheerio     = require('cheerio');
// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22sfo%22&format=json&diagnostics=true&callback=
module.exports = function (ticker, sendCallback, saveCallback) {
  console.log("GETTING SUMMARY".cyan);
  console.log(("TICKER: " + ticker).cyan);
  var financeDetails = new Array();
  var keyStr         = new Array();
  var jsonVar = {};
  var yUrl = "http://finance.yahoo.com/q/ks?s=" + ticker + "callback=myCallback";

  request(yUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = jquery.load(body);

      var td = $('.yfnc_tablehead1');
      $(td).each(function(j, val) {
        keyStr[j] = $(val).text();
      });

      var tData = $('.yfnc_tabledata1');
      $(tData).each(function(j, val) {
        jsonVar[keyStr[j]] = $(val).text();
      });

      // Let's do something with the data we have
      // for (var i=0; i < financeDetails.length; i++) {
        // console.log (i + ") " + keyStr[i] + " " + financeDetails[i]);

      sendCallback(jsonVar);
      saveCallback(jsonVar);
    } else {
      if (!error) {
        error = "That ticker cannot be found on yahoo finance!";
      }
      sendCallback({ status: 400, error: error })
    }
  });
}