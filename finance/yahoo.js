var request     = require('request');
var cheerio     = require('cheerio');

var functions = {
  summary: function (ticker, sendCallback, saveCallback) {
    console.log("GETTING SUMMARY".cyan);
    console.log(("TICKER: " + ticker).cyan);
    var financeDetails = new Array();
    var keyStr         = new Array();
    var jsonVar = {};
    var yUrl = "http://finance.yahoo.com/q/ks?s=" + ticker;

    request(yUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);

        var td = $('.yfnc_tablehead1');
        $(td).each(function(j, val) {
          keyStr[j] = $(val).text();
        });

        // the values
        // TODO: normalize them
        var tData = $('.yfnc_tabledata1');
        $(tData).each(function(j, val) {
          jsonVar[keyStr[j]] = $(val).text();
        });

        // Let's do something with the data we have
        // for (var i=0; i < financeDetails.length; i++) {
          // console.log (i + ") " + keyStr[i] + " " + financeDetails[i]);
        // }
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
}

exports.request = function (args, sendCallback, saveCallback) {
  console.log("REQUEST ISSUED".cyan);
  functions[args['job']](args['ticker'], sendCallback, saveCallback);
}; // -- end of request --