
var functions = {
 // historical: require('./historical/historical.js').funct,
  summary: require('./summary.js').funct
}

module.exports  = function (job, params, sendCallback, saveCallback) {
  functions[job](params, sendCallback, saveCallback);
}; // -- end of request --