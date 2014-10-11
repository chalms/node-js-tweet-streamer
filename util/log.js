fs = require('fs');
var util = require('util');
var colors = require('colors');

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

Log.prototype.clearBatchCallback = function (item) {
  console.info("CLEAR BATCH CALLBACK".yellow);
  if (item) {
    console.info("CLEAR BATCH -> ITEM EXISTS".green);
    if (item.hasOwnProperty('user')) {
      console.info("CLEAR BATCH -> ITEM HAS PROPERTY 'user'".green);
      if (item.user.hasOwnProperty('id')) {
        console.info("CLEAR BATCH -> USER HAS ID".green);
      } else if (item.user.hasOwnProperty('id_str')) {
        console.log("USER HAS ID_STR: ".yellow);
        console.log(colors(item.user.id_str.toUpperCase()).green);
      }
    }
  }
}


Log.prototype.logCollectionView = function (errors, data) {
  var str1 = "COLLECTION DATA -> " + data;
  console.log(colors.yellow(str1.toUpperCase()));
  var str2 = "ERRORS -> " + errors;
  console.log(colors.red(str2.toUpperCase()));
  for (var i in data) {
    console.log(data[i]['indexes']);
  }
}

Log.prototype.query = function (args) {
  console.log("\n---- Generating Query ----\n".toUpperCase().green);
  console.log("Arguments:".toUpperCase());
  console.log(args);
  console.log("Issuing query!: \n".toUpperCase().green);
};

Log.prototype.historicalRunning = function (stack) {
  console.log("phantom create -> runIt(result)".toUpperCase());
  console.log(stack);
};

Log.prototype.passbackStackData = function (passedStack) {
    console.log("Load to mongo callback with: ".toUpperCase());
    console.log(passedStack);
};


Log.prototype.itemsMoreThanTwenty = function () {
  console.log("Items More Than 20!".toUpperCase().yellow);
}

Log.prototype.callingCallbackWithItems = function (it, items) {
  console.log("calling callback with item [1] and items [2] array ->".toUpperCase());
  console.log(it.toString().toUpperCase().blue);
  console.log(items.toString().toUpperCase().blue);
}

Log.prototype.batchCleared = function () {
  console.log("BATCH CLEARED".green);
}


Log.prototype.twitSearchError = function (err) {
    console.log("~~~~~~ search returned error, as seen below~~~~~~~~".toUpperCase().red);
    console.log(err);
};

Log.prototype.twitSearchSuccess = function (data) {
    console.log("~~~~~~~ no error found, data below ~~~~~~~~".toUpperCase().green);
    console.log("~~~~~~~~ calling mongo client with data and _this.collection ~~~~~~~~".toUpperCase().blue);
};

Log.prototype.twitStreamCreated = function (collectionName) {
  var str = "Twit Stream created with collection name: " + collectionName;
  console.log(colors.green(str.toUpperCase()));
};

Log.prototype.twitDataSaved = function (data_result) {
  console.log(colors.yellow("Twit data saved executed".toUpperCase()));
  var str = "The mongo data result: " + data_result;
  console.log(colors.yellow(str.toUpperCase()));
};

Log.prototype.requestBody = function (req) {
  console.log("Request Arguements: \n".toUpperCase().yellow);
  console.log(req.body);
};

Log.prototype.keyValue = function (functions, key) {
  var str = "running function: " + key + " with function below";
  console.log(colors.yellow(str.toUpperCase()));
  console.log(colors.green(functions[key]));
};

Log.prototype.queryError = function (err) {
  console.log(err.red);
};

Log.prototype.queryResponse = function (response) {
  console.log("Issuing query response: ".toUpperCase().yellow);
  console.log(response.yellow);
};

Log.prototype.userLookupResponse = function (response) {
  console.log(colors.yellow("USER LOOKUP RESPONSE -> " + response));
  console.log(response.green);
};

Log.prototype.userRequestAndPushResponse = function (response) {
  var str = "USER LOOKUP RESPONSE -> " + response;
  console.info(colors.green(str.toUpperCase()));
};

Log.prototype.refPushedRequestItem = function () {
  console.info("_REF PUSHED REQUEST ITEM".green);
}

Log.prototype.callbackOnSoloInsertion = function (d, fn) {
  console.log("Calling this function: ".toUpperCase().yellow);
  console.log(fn.blue);
  console.log("Using this data: ".toUpperCase().blue);
  console.log(d.yellow);
};

Log.prototype.responseHadWrongKeys = function (response) {
  console.log("Response did not have the right keys: ".toUpperCase().red);
  console.log(response.red);
};

Log.prototype.responseNotObject = function (response) {
  console.log("Response was not an object: ".toUpperCase().red);
  console.log(response.red);
};


Log.prototype.searchArgs = function(args) {
  console.log("\n --- Search args --- ".toUpperCase().blue);
  console.log(args.yellow);
};

Log.prototype.adjustingInterval = function (interval) {
  var str = "Adjusting Interval: " + interval;
  console.log(colors.yellow(str.toUpperCase()));
}

Log.prototype.getDocumentCountWrite = function (collectionName) {
  console.log("Write before potential error: ".toUpperCase().yellow);
  console.log(collectionName.green);
}

Log.prototype.checkingMinMaxArgs = function (args) {
  console.log("Checking min max value args: ".toUpperCase().yellow);
  console.log(color.blue(args));
}

Log.prototype.inSetNewQuery = function () {
  console.log(color.green("In set new query".toUpperCase()));
}

Log.prototype.getDocumentCountStart = function (collectionName) {
  console.log("getDocument Count: ".toUpperCase().blue);
  console.log(color.blue(collectionName));
}

Log.prototype.mongoConnectingError = function () {
  console.log("Error connecting to mongo".toUpperCase().red);
}

Log.prototype.bundleExecuted = function () {
  console.log("bundle executed!".toUpperCase().red);
}

Log.prototype.callMeCallbackCalled = function () {
  console.log("callMe() callback called".toUpperCase().blue);
}

Log.prototype.errorGettingCollection = function () {
  console.log("Error getting collection: ".toUpperCase().red);
}

Log.prototype.getDocumentCountError = function (collectionName) {
  console.log("~~~~~~Error getting collection~~~~~~".toUpperCase().red);
  console.log(collectionName.blue);
}

Log.prototype.intervalAdjustmentFailed = function () {
  console.log("Interval cannot be adjusted".toUpperCase().red);
}

Log.prototype.aborting = function () {
  console.log("Abort Called!".toUpperCase().green);
}

Log.prototype.startingBot = function (query, collectionName) {
  var str = "Starting data bot with query: " + query + ", collectionName: " + collectionName;
  console.log(colors.green(str.toUpperCase()));
}
Log.prototype.queryAndCollectionName = function (query, collectionName) {
  console.log(colors.yellow("In calculate value.\n _this.collectionName: ".toUpperCase()));
  console.log(colors.blue(collectionName));
  console.log(colors.blue(query));
}

Log.prototype.issueQueryCallbackData = function (data) {
  console.log("Callback data: ".toUpperCase().yellow);
  // console.log(data);
}

Log.prototype.newDocumentCount = function (c) {
  var str = "New document count found to be: " + c;
  console.log(colors.green(str.toUpperCase()));
  console.log("Issuing query with args: ".toUpperCase().yellow);
}

Log.prototype.issueQueryResponse = function (queryParams) {
  console.log("issue query called with response: ".toUpperCase());
  console.log(queryParams);
}

Log.prototype.writeNumberAndCount = function(number, count) {
  console.log("variation in ongoing count calculated".toUpperCase());
  var str = "number calculated to be: " + number;
  console.log(str);
  var str1 = "count is: " + count;
  console.log(str1);
}

Log.prototype.insertionError = function (err) {
  console.log("~~~~~~ insertion error below~~~~~".toUpperCase());
  console.log(err);
};

module.exports = new Log();