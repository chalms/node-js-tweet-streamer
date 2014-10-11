fs = require('fs');
var util = require('util');

Log = function () {
  this.path = './util/logfile.txt';
  this.l = fs.createWriteStream(this.path, { 'flags': 'a' });
};

Log.prototype.write = function(someText) {
  this.l.write(someText);
};

Log.prototype.wipe = function () {
  fs.truncate(this.path, 0);
};

Log.prototype.query = function (args) {
  console.log("\n---- Generating Query ----\n");
  console.log("Arguments:");
  console.log(args);
  console.log("Issuing query!: \n");
};

Log.prototype.historicalRunning = function (stack) {
  console.log("phantom create -> runIt(result)");
  console.log(stack);
};

Log.prototype.passbackStackData = function (passedStack) {
    console.log("Load to mongo callback with: ");
    console.log(passedStack);
};

Log.prototype.twitSearchError = function (err) {
    console.log("~~~~~~ search returned error, as seen below~~~~~~~~");
    console.log(err);
};

Log.prototype.twitSearchSuccess = function (data) {
    console.log("~~~~~~~ no error found, data below ~~~~~~~~");
   // console.log(data);
    console.log("~~~~~~~~ calling mongo client with data and _this.collection ~~~~~~~~");
};

Log.prototype.twitStreamCreated = function (collectionName) {
  console.log("Twit Stream created with collection name: " + collectionName);
};

Log.prototype.twitDataSaved = function (data_result) {
  console.log("Twit data saved executed");
  console.log("The mongo data result: " + data_result);
};

Log.prototype.requestBody = function (req) {
  console.log("Request Arguements: \n");
  console.log(req.body);
};

Log.prototype.keyValue = function (functions, key) {
  console.log("running function: " + key + " with function below");
  console.log(functions[key]);
};

Log.prototype.queryError = function (err) {
  console.log(err);
};

Log.prototype.queryResponse = function (response) {
  console.log("Issuing query response: ");
  console.log(response);
};

Log.prototype.callbackOnSoloInsertion = function (d, fn) {
  console.log("Calling this function: ");
  console.log(fn);
  console.log("Using this data: ");
  console.log(d);
};

Log.prototype.responseHadWrongKeys = function (response) {
  console.log("Response did not have the right keys: ");
  console.log(response);
};

Log.prototype.responseNotObject = function (response) {
  console.log("Response was not an object: ");
  console.log(response);
};


Log.prototype.searchArgs = function(args) {
  console.log("\n --- Search args --- ");
  console.log(args);
};

Log.prototype.adjustingInterval = function (interval) {
  console.log("Adjusting Interval: " + interval);
}

Log.prototype.getDocumentCountWrite = function (collectionName) {
  console.log("Write before potential error");
  console.log(collectionName);
}

Log.prototype.checkingMinMaxArgs = function (args) {
  console.log("checking min max value args");
  console.log(args);
}

Log.prototype.inSetNewQuery = function () {
  console.log("in set new query");
}

Log.prototype.getDocumentCountStart = function (collectionName) {
  console.log("getDocument Count");
  console.log(collectionName);
}

Log.prototype.mongoConnectingError = function () {
  console.log("error connecting to mongo");
}

Log.prototype.bundleExecuted = function () {
  console.log("bundle executed!");
}

Log.prototype.callMeCallbackCalled = function () {
  console.log("callMe() callback called");
}

Log.prototype.errorGettingCollection = function () {
  console.log("error getting collection");
}

Log.prototype.getDocumentCountError = function (collectionName) {
  console.log("~~~error getting collection~~~~~~");
  console.log(collectionName);
}

Log.prototype.intervalAdjustmentFailed = function () {
  console.log("Interval cannot be adjusted");
}

Log.prototype.aborting = function () {
  console.log("Abort Called!");
}

Log.prototype.startingBot = function (query, collectionName) {
  console.log("Starting data bot with query: " + query + ", collectionName: " + collectionName);
}
Log.prototype.queryAndCollectionName = function (query, collectionName) {
  console.log("in calculate value.\n _this.collectionName: ");
  console.log(collectionName);
  console.log(query);
}

Log.prototype.issueQueryCallbackData = function (data) {
  console.log("Callback data: ");
  // console.log(data);
}

Log.prototype.newDocumentCount = function (c) {
  console.log("new document count found to be: " + c);
  console.log("issuing query with args: ");
}

Log.prototype.issueQueryResponse = function (queryParams) {
  console.log("issue query called with response: ");
  console.log(queryParams);
}

Log.prototype.writeNumberAndCount = function(number, count) {
  console.log("variation in ongoing count calculated");
  console.log("number calculated to be: " + number);
  console.log("count is: " + count);
}

Log.prototype.insertionError = function (err) {
  console.log("~~~~~~ insertion error below~~~~~")
  console.log(err);
};

module.exports = new Log();