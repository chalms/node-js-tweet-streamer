
var functions = {
  historical: require('./historical.js').funct
  summary: require('./summary.js').funct
}

exports.request = function (job, params, sendCallback, saveCallback) {
  functions[job](params, sendCallback, saveCallback);
}; // -- end of request --