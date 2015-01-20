var router = require('express').Router();
var mongo = require('mongodb').MongoClient;

var url = "mongodb://Andrew:twitter@ds053469.mongolab.com:53469/tweets";
var collection;
mongo.connect(url, function (err, db) { collection = db.collection('articles').toArray() } );

router.get('/', function(req, res, next) {
  res.render('index', collection, function (err, html) {
    res.send(html);
  });
});

router.get('/article/:id', function(req, res, next) {
  res.render('', collection, function (err, html) {
    res.send(html);
  });
});

router.post('/article/:id', function(req, res, next) {
  res.render('', collection, function (err, html) {
    res.send(html);
  });
});