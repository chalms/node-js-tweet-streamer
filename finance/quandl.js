var request     = require('request');

var functions = {
  show: function(h, sendCallback, saveCallback) {
    var defaults = {
      version: '2',
      dataset: 'GOOG',
      collection: 'AAPL',
      format: 'json', //["xml", "csv", "json"]
      auth_token: 'y3CsPUaHAxTesuNnRo7k'
    }

    var options = {
      trim_start: '',
      trim_end: '',
      row: '',
      exclude_headers: '',
      transformation: '', //["none", "diff", "rdiff", "cumul", "normalize"]
      sort_order: ''
    }

    for (var key in defaults) {
      if (h[key] === null || h[key] === '') {
        h[key] = defaults[key];
      }
    }

    var optionsString = "";
    for (key in h) {
      if (options[key] === '') {
        optionsString = optionsString + '&' + key + '=' + h[key] ;
      }
    }


    var url = "http://www.quandl.com/api/v" + h['version'] + "/datasets/" + h['dataset'] + "/" + h['collection'] + "." + h['format'] + "?auth_token=" + h['auth_token'] + optionsString;

    request(url, function (error, response, data) {
      if (!error) {
        sendCallback({status: 400, error: "Error getting data!"});
      } else {
        if (h['format'] === 'json') {
          sendCallback(JSON.parse(data));
          saveCallback(JSON.parse(data));
        }
      }
    });
  },
  search: function (q, sendCallback, saveCallback) {
    var defaults = {
      query: '*',
      version: '2'
    }

    var options = {
      source_code: 'WIKI', //WIKI
      per_page: '300', //300
      page: '1' //1
    }

    for (var key in defaults) {
      if (q[key] === null || q[key] === '') {
        q[key] = defaults[key];
      }
    }

    var optionsString = "";
    for (key in q) {
      if (options[key] === '') {
        optionsString = optionsString + '&' + key + '=' + q[key] ;
      }
    }

    var url = "http://www.quandl.com/api/v" + q['version'] + "/datasets/" + "." + q['format'] + "?auth_token=" + q['auth_token'] + optionsString;

    request(url, function (error, response, data) {
      if (!error) {
        sendCallback({status: 400, error: "Error getting data!"});
      } else {
        if (h['format'] === 'json') {
          sendCallback(JSON.parse(data));
          saveCallback(JSON.parse(data));
        }
      }
    });
  }
}

exports.request = function (args, sendCallback, saveCallback) {
  functions[args['job']](args['params'], sendCallback, saveCallback);
}
