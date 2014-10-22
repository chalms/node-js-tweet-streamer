var router = require('express').Router();

var collection = mongo.connectSync(function (db) { return db.collection('articles'); } );

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