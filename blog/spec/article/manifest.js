module.exports = [{
  "describe":"Article",
  "it":"Should Create an Article object",
  value: function (callback) {
    callback();
  },
  expect: function (value, other, callback) {
    callback('value === other');
  }
}]
