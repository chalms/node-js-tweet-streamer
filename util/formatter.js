module.exports.makeDate = function (date) {
	var dateString;
	if (date instanceof Date) {
		dateString = date.getFullYear().toString() + "-";
		dateString += date.getMonth().toString() + "-";
		dateString += date.getDate().toString();
	} else {
		dateString = date;
	}
	return dateString;
}

module.exports.makeAfterDate = function (date) {
	var dateString = this.makeDate(date);
	dateString = "since:" + dateString;
	console.log("makeAfterDate");
	console.log(dateString);
	return dateString;
}

module.exports.makeBeforeDate = function (date) {
	var dateString = this.makeDate(date);
	dateString = "until:" + dateString;
	console.log("makeBeforeDate");
	console.log(dateString);
	return dateString;
}

module.exports.makeSentence = function(str) {
		return "\"" + str + "\"";
}

module.exports.makeNot = function (str) {
		return  " -" + str;
}

module.exports.makeOr = function (str) {
		return  " OR " + str;
}


