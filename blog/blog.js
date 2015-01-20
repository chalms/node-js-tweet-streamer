
var mongo = require('../db/connection.js');


function Blog(doc) {
  this.doc = doc;
  this.articles = [];
}

