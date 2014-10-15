//
// Chewy Modular Node.js
// Andrew Chalmers - October 20 2014
// Licensed by MIT

var functions = {}
exports.request = function (job, params, sendCallback, saveCallback) {
  functions[job](params, sendCallback, saveCallback);
};
