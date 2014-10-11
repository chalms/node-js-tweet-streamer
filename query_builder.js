formatter = require('./util/formatter.js');
util = require('util');
var log = require('./util/log.js');

QueryBuilder = function () {
	this.query = "";
	this.queryArgs = {};
	this.searchArgs = {};
	this.streamArgs = {};
	this.dateArgs = {};
	_this = this;

	function addAfterDate(date) {
		try {
			if (!date) return;
			if (date.typeof === 'string') date = Date.new(date);
		} catch (err) {
			log.write(err.stack)
			return;
		}
		_this.dateArgs['since'] = formatter.makeDate(date);
	}

	function addLinkFilter(non) {
		_this.queryArgs['filter'] = "filter:links";
	}

	function addSource(non) {
		_this.queryArgs['source'] = "source:twitterfeed";
	}

	function addResultType(resultType) {
		if (!(resultType === "mixed" || resultType === "popular" || resultType === "recent")) return;
		_this.searchArgs["result_type"] = resultType;
	}

	function addPage(page) {
		var p = parseInt(page)
		if (!p) return;
		if (p < 1) return;
		_this.searchArgs["page"] = p.toString()
	}

	function addBeforeDate(date) {
		try {
			if (!date) return;
			if (date.typeof === 'string') date = Date.new(date);
		} catch (err) {
			log.write(err.stack);
			return;
		}
		console.log(formatter.makeDate(date));
		_this.dateArgs['until'] = formatter.makeDate(date);
	}

	function setGeoCode (hash) {
		if (!hash["radius"]) return;
		if (!(hash["latitude"] && hash["longitude"] && hash["radius"]["unit"]  && hash["radius"]["value"])) return;
		_this.searchArgs["geocode"] = hash["latitude"] + "," + hash["longitude"] + "," + hash["radius"]["value"] + hash["radius"]["unit"];
	}

	function setSinceId (id) {
		if (!id) return;
		id = (id.typeof === 'string') ? parseInt(id) : id
		_this.searchArgs["since_id"] = id
	}

	function addTrackingWords(arr) {
		if (!arr) return;
		arr = (arr.typeof === 'string') ? [arr] : arr;
		_this.streamArgs['track'] = arr;
	}

	function addLocations(arr) {
		if (!arr) return;
		if (arr.typeof !== 'string') return;
		arr[0] = (arr[0].typeof === Array) ? arr[0] : [arr[0]];
		for (var i in arr) { if (arr[i].typeof === Array) arr[i].unshift(i); };
		_this.streamArgs['location'] = arr;
	}

	function addLimit(limit) {
		_this.streamArgs["limit"] = limit ? ((limit.typeof === int) ? limit : parseInt(limit)) : 100
	}

	function addTimeLimit(timeLimit) {
		_this.streamArgs["timeLimit"] = timeLimit ? ((timeLimit.typeof === int) ? timeLimit : parseInt(timeLimit)) : 10000
	}

	function addQuery(query) {
		_this.query = query;
	}

	var params = {
		linkFilter: addLinkFilter,
		source: addSource,
		page: addPage,
		since: addAfterDate,
		until: addBeforeDate,
		geocode: setGeoCode,
		since_id: setSinceId,
		result_type: addResultType,
		track: addTrackingWords,
		location: addLocations,
		limit: addLimit,
		timeLimit: addTimeLimit,
		q: addQuery
	}

	this.buildSearch = function (hash, callback) {
		if (!hash["q"]) {
      console.log(hash);
      console.log("not a search") ;
      return;
    }
		console.log("building search!");

		for (var key in hash) {
			if(hash[key]) {
				params[key](hash[key])
			} else {
				params[key]();
			}
		}

		for (var key in this.args) {
			_this.query = _this.query + " " + _this.queryArgs[key];
		}

		for (var key in _this.dateArgs) {
			var dateArgsString = " " + key + ":" + _this.dateArgs[key];
			_this.query = _this.query + dateArgsString;
			console.log(dateArgsString);
		}

		if (!_this.query) return;
		_this.searchArgs["q"] = _this.query;

    console.log(_this.query);
		callback(_this.searchArgs);
	}

	this.buildStream = function (hash) {
		if (!hash) return;
		if (!hash.hasOwnProperty("track")) return;
		for (var key in hash) {
			if(hash[key]) {
				params[key](hash[key])
			} else {
				params[key]();
			}
		}
		if (_this.streamArgs["track"]) {
			return this.streamArgs;
		} else {
			return "no words to track!";
		}
	}
}

module.exports = QueryBuilder;