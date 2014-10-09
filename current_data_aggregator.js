/*
module.exports = function launchDataAggregator(req, res, writeResponseFunct) {
  MongoClient.setNewQuery('current_data_aggregator', 
    req.body["query"], 
    req.body["collectionName"],
    function (result, writeResponseFunct) {
          if (timers.hasOwnProperty('current_data_aggregator')) {
            timers['current_data_aggregator']startJob(result["query"], result["collectionName"])
          } else {
            timers['current_data_aggregator'] = new DataBot(10000, 5000, 10, 'current_data_aggregator'); 
            timers['current_data_aggregator']startJob(result["query"], result["collectionName"]); 
          }
          writeResponseFunct(result); 
    }, 
    writeResponseFunct
  );
}
*/