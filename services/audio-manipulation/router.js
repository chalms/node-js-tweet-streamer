//
// Chewy Modular Node.js
// Andrew Chalmers - October 20 2014
// Licensed by MIT

/*
  // Below is a sample job for multiplication done by the server.

  var multiply = function (params, sendCallback, saveCallback) {
    try {
      var a = params["a"];
      var b = params["b"];
      var result = a * b;
      sendCallback({ result: result });
    } catch (error) {
      sendCallback({ error: "Multiplication didn't work! "});
    }
  }

  // Jobs can be written in the router, or in seperate files.

  // The client can retreive the following JSON: { result: 4 }

  // With the route: www.{whatever}.com/services/audio-manipulation/multiply/a=2&b=2.json

  // Here is the sample router:

  var functions = {
    multiply: multiply
  }
*/

var functions = {}
exports.request = function (job, params, sendCallback, saveCallback) {
  functions[job](params, sendCallback, saveCallback);
};
