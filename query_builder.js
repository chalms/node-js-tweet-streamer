formatter = require('./formatter.js');

QueryBuilder = function (args) {
	this.query = "";
	this.args = {}; 

	this.add = function (str) {
		if (str != "") {
			this.query = this.query + " " + str;
		}
	}

	this.addOr = function (str) {
		this.add(formatter.makeOr(str));
	}

	this.addPositiveAttitude = function () {
		this.args['attitude'] = ":)";
	}

	this.addNegativeAttitude = function () {
		this.args['attitude'] = ":(";
	}

	this.makeQuestion = function() {
		this.args['question'] = "?";
	}

	this.addBeforeDate = function(date) {
		this.args['beforeDate'] = formatter.makeBeforeDate(date);
	}

	this.addAfterDate = function (date) {
		this.args['afterDate'] = formatter.makeAfterDate(date);
	}

	this.addLinkFilter = function () {
		this.args['filter'] = "filter:links"; 
	}

	this.addSource = function () {
		this.args['source'] = "source:twitterfeed"
	}

	this.build = function () {
		for (var key in args) {
			this.query = this.query + " " + args[key]; 
		}
		return this.query; 
	}
}

module.exports = QueryBuilder; 