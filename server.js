net = require('net');

Server = function (callback) {
  this.clients = {}; 
  this.callback = callback; 
  _this = this;

  _this.server = net.createServer(function (socket) {

    _this.socket = socket;
    _this.name = (String)(socket.remoteAddress + ":" + socket.remotePort); 
    _this.clients[this.name] = socket; 
    
    function removeEndline(str) {
    return str.replace(/(\r\n|\n|\r)/gm, "");
    }

    function clean(data) {
      for (var d in data) {
        data[d] = removeEndline(data[d].toString());
      }
      return data;
    }

    function writeToSocket(socket, tweets) {
      console.log("in writetosocket -> with socket ---> "); 
      console.log(socket); 
      console.log("writing tweets..."); 
      socket.write(tweets);
      console.log("finished 'socket.write.tweets");
    }

    _this.socket.on('data', function(data) {
      console.log(data.toString()); 
      var json_data = JSON.parse(data);
      console.log(json_data.toString()); 
      var clean_data = clean(json_data);
      console.log(clean_data.toString());
      _this.callback(clean_data, _this.socket, writeToSocket); 
    }); 

    _this.socket.on('end', function () {
      delete clients[_this.name]; 
    }); 

  }).listen(3000); 
}; 

module.exports = Server;

