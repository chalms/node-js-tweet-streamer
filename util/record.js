fs = require('fs');

Record = function () {
  this.path = './util/tweetfile.txt';
  this.l = fs.createWriteStream(this.path, { 'flags': 'a' });
};
Record.prototype.write = function(someText) {
  this.l.write(someText);
}

Record.prototype.wipe = function () {
  fs.truncate(this.path, 0);
}

module.exports = new Record();