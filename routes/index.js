var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var parser = bodyParser.urlencoded();

/* GET home page. */
router.get('/', function (req, res, next) {
  express.module.db;
  mongo.connect('mongodb://127.0.0.1:27017/mwa', function (err, db) {
    //var id = req.query.id;
    db.collection('location').find().toArray(function (err, docArr) {
      console.dir(docArr[0]._id);
      res.render('index', { title: 'Express', locations: docArr });
    });
    return db.close();
  });
});

router.get('/index/update', function (req, res, next) {
  mongo.connect('mongodb://127.0.0.1:27017/mwa', function (err, db) {
    var id = req.query.id;
    db.collection('location').findOne({ '_id': id }, function (err, doc) {
      console.dir("LocationName: " + doc.name);
      res.render('update', { title: 'Express', location: doc });
    });
    return db.close();
  })
});

router.post('/index/update', parser, function (req, res, next) {
  // var id = req.query.id;

  mongo.connect('mongodb://127.0.0.1:27017/mwa', function (err, db) {

    console.log(req.body.id);
    console.log(req.body.name);
    var query = { '_id': req.body.id };
    var operator = { 'name': req.body.name, 'category': req.body.category, 'longitude': req.body.longitude, 'latitude': req.body.latitude }
    var options = { 'upsert': true };
    db.collection('location').update(query, operator, options, function (err, doc) {
      if (err) throw err;
      console.dir("Successful update Location: " + doc);
      res.redirect('/index');
      // res.render('/', { title: 'Express', location: doc });
      db.close();
      res.end();
    });
  })
  res.end();
});

router.get('/index/add', parser, function (req, res, next) {
  res.render('add', { title: 'Add Location' });
});

router.post('/index/add', parser, function (req, res, next) {
  mongo.connect('mongodb://127.0.0.1:27017/mwa', function (err, db) {
    var query =  {'name': req.body.name, 'category': req.body.category, 'longitude': req.body.longitude, 'latitude': req.body.latitude};
    var options = { 'upsert': true }
    console.log(req.body.name);
    db.collection('location').insert(query, options, function (err, doc) {
      if (err) throw err;
      //console.dir(doc);
      // res.render('index', { title: 'Home' });
    });
  })
res.end();
});

router.get('/index/delete', function (req, res, next) {
  mongo.connect('mongodb:/127.0.0.1:27017/mwa', function (err, db) {
    db.collection('location').remove();
  })
  res.render('success', { title: 'Success' });
});

module.exports = router;
