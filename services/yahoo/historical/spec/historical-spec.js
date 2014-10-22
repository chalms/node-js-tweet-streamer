var request = require("request");
var accepts = require("./accepts");
var rejects = require("./rejects");

module.exports = function () {
  this.accepts = require("./accepts");
  this.rejects = require("./rejects");
  _this = this;

  this.runAccepts = function () {

  }

  this.runRejects = function () {

  }

  this.run = function () {
    _this.runAccepts();
  }
}