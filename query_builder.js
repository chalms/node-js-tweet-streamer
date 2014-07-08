formatter = require('./formatter.js');

QueryBuilder = function () {
	this.query = "";
	this.args = {}
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

	params_without_input = { 
		question: this.makeQuestion,
		positiveAttitude: this.positiveAttitude,
		negativeAttitude: this.addNegativeAttitude, 
		addLinkFilter: this.addLinkFilter,
		addSource: this.addSource
	}

	params_with_input = {
		add: this.add,
		addOr: this.addOr,
		addBeforeDate: this.addBeforeDate, 
		addAfterDate: this.addAfterDate
	}

	this.build = function (args) {
		console.log("THIS.ARGS"); 
		console.log(this.args); 
		if (args != undefined && args != null) {
			for (var key in args) {
				if (params_without_input[key]) {
					params_without_input[key](); 
				} else if (params_with_input[key]) {
					params_with_input[key](args[key]); 
				}
			}
		}
		for (var key in this.args) {
			this.query = this.query + " " + this.args[key]; 
		}
		return this.query; 
	}
}

module.exports = QueryBuilder; 