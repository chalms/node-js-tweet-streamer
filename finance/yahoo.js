var request     = require('request');
var cheerio     = require('cheerio');

exports.request = function (ticker, sendCallback, saveCallback) {
  if (ticker === null) throw err;
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
}; // -- end of request --