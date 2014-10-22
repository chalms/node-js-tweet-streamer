module.exports = [{
  "id_str": "historical-accepts-1",
  "description": "Accept, send and save valid output",
  "input": {
    "start": "2013-00-01",
    "end": "2014-00-02",
    "ticker": "AAPL"
  },
  "it should": [{
    "send": {
      "data": "need the data here!",
      "status": 200
    }
  }, {
    "not": {
      "throw": "error",
      "before": "send-callback"
    }
  }, {
    "save": {
      "data": "#{data}",
      "collection": "#{collection}",
      "db": "#{db}"
    }
  }],
}];