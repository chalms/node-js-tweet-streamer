fs = require('fs');


Log = function () {
  this.path = './util/logfile.txt';
  this.l = fs.createWriteStream(this.path, { 'flags': 'a' });
};

Log.prototype.write = function(someText) {
  this.l.write(someText);
}

Log.prototype.wipe = function () {
  fs.truncate(this.path, 0);
}

module.exports = new Log();