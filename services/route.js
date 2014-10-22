module.exports = function (type, retVal, d, params, req, next) {
  var service = serviceList[req.params.service];
  var serverFunction = service.hasOwnProperty(type) ? service[type][d] : service[d];
  var saveCallback = serverFunction.hasOwnProperty("save") ? service["save"] : defaultSave[retVal];
  var sendCallback = serverFunction.hasOwnProperty("send") ? service["send"] : defaultSend[retVal];
  serverFunction(params, saveCallback, sendCallback);
  next();
}