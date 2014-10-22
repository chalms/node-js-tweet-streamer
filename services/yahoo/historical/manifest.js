module.exports = {
  "language": "Javascript",
  "input": require('./params.js'),
  "schema": require('./schema.js'),
  "tests": {
    "accepts": require('./spec/accepts.js'),
    "rejects": require('./spec/rejects.js')
  }
}

