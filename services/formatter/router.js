var js2xmlparser = require("js2xmlparser");
var jade = require("jade");

var functions = {
  html: function (data, callback) {
    var fn = jade.compileFile('./views/table.jade', {});
    var html = fn({data: data});
    callback(html);
  },

  csv: function (data, callback) {

    console.log("IN CSV FUNCTION".red);

    var str = "";
    var keySet = [];
    for (var k in data) keySet.push(k);

    try {
      function runLoop(key) {

        console.log("RUN LOOP");
        var j = data[key];

        function addStr(d, key) {
          if (key[key.length-1] === ':') {
            key = key.substring(0, key.length - 1);
          }

          str = str + key + " , " + d + "\n";

          if (keySet.length > 0) {
            runLoop(keySet.pop());
          } else {
            console.log(keySet.length);
            callback(str);
          }
        }
        (typeof j === 'object') {
          inspect.inspect(j, function (d) {
            addStr(d, key);
          });
        } else {
          addStr(j, k);
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (keySet.length > 0) {
      var key = keySet.pop();
      console.log("RUNNING RUN LOOP".red);
      runLoop(key);
    }
  },

  text: function (data, callback) {
    callback(JSON.stringify(data));
  },

  json: function (data, callback) {
    callback(JSON.stringify(data));
  },

  xml: function (data, callback) {

    function runLoop(data, callback) {

      var keySet = [];
      var keys = {};
      for (var k in data) {
        keySet.push(k);
      }

      while (keySet.length > 0) {

        var key = keySet[0];
        var firstKey = keySet[0];
        var value = data[firstKey];
        var index = keySet.indexOf(firstKey);

        delete data[key];

        key = firstKey.replace(/[\W_]+/g,"");

        function removeKeyFromSet(result, index, cb) {
          data[key] = result;
          keySet.splice(index, 1);
          if (keySet.length === 0) callback(data);
        }

        if (value === 'object') {
          runLoop(value, function (result) {
            removeKeyFromSet(result, index, function () {});
          });
        } else {
          removeKeyFromSet(result, index, function () {});
        }
      }
    }

    runLoop(data, function (result) {
      callback(js2xmlparser("doc", result));
    });
  }
}


exports.request = function (args, sendCallback, saveCallback) {
  functions[args['job']](args['params'], sendCallback, saveCallback);
}