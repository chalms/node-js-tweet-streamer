
var serviceList = {
  yahoo: require('./yahoo/router.js')
}

module.exports = function (reqType, req, res, next) {
  console.log(req.body.service);
  var service = serviceList[req.body.service];
  var job = service(req.body.job, req.body.args, function (sendData) {
    res.write(sendData);
    res.end();
  }, function (saveData) {
    console.log("Save callback!");
    console.log(saveData);
  });
  // var serverFunction = service.hasOwnProperty(type) ? service[type][d] : service[d];
  // var saveCallback = serverFunction.hasOwnProperty("save") ? service["save"] : defaultSave[retVal];
  // var sendCallback = serverFunction.hasOwnProperty("send") ? service["send"] : defaultSend[retVal];

  next();
}