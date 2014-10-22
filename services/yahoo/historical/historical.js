module.exports = function(args, sendCallback, saveCallback) {
    var format;

    if (args["format"] === null) {
      format = "csv"
    } else {
      format = args["format"];
    }

    if (args["start"] === null){
      sendCallback({ error: "Url needs params: start=<start-time>"})
      return;
    }

    if (args["end"]) === null) {
      args["end"] = new Date();
    } else {

    var d = new Date("2013-07-31");

    var gsDayNames = new Array(
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    );

    }

    var dayName = gsDayNames[d.getDay()];

    if (args["ticker"] === null) throw err;
    var url  = "http://ichart.yahoo.com/table." + format + "?s=" + args["ticker"];
  }
}