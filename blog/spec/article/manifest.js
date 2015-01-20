module.exports = [{
  "describe":"Article",
  "it":"Should Create an Article object",
  value: function (params, callback) {
    callback(new Article(params));
  },
  expect: function (value, other, callback) {
    callback(value === other);
  }
}]
