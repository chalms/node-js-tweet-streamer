module.exports = [{
    "id_str":"historical-rejects-1",
    "description": "No start date",
    "input": {
      "end": "2014-00-02",
      "ticker": ""
    },
    "it should": [{
      "throw": "error",
      "before": "send-callback"
    },{
      "send": {
        "error": "No Start Date!",
        "status": 400
      },
      "before": "save-callback"
    }],
  }, {
    "id_str":"historical-rejects-2",
    "description": "Invalid ticker",
    "input": {
      "start": "2016-00-01",
      "end": "2014-00-02",
      "ticker": "INVALID_TICKER"
    },
    "it should": [{
      "throw": "error",
      "before": "send-callback"
    }]
  }, {
    "id_str":"historical-rejects-3",
    "description": "Invalid date",
    "input": {
      "start": "2016-00-01",
      "end": "2014-00-02",
      "ticker": ""
    },
    "it should": [{
      "throw": "error",
      "before": "send-callback"
    }, {
    "send": {
      "error": "Invalid Date!",
      "status": 400
    }
  }]
}];