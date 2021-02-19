var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { DB_URL, DB_NAME } = require('../constants');
const auth = require('../auth');

router.get('/getCountries', (req, res, next) => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    dbo.collection('countries').find({}).sort({ name: 1 }).toArray((err, countries) => {
      if (err) throw err;
      res.send(countries);
    })
    db.close();
  })
});

router.post('/addCountry', auth.requiresAdmin, (req, res) => {
  //console.log(JSON.stringify(req.body));
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    const name = { ...req.body }
    dbo.collection('countries').insertOne(name, (err, res) => {
      if (err) throw err;
      db.close();
    })
    return res.status(200).json({ message: 'Country added successfully' });
  })
});


module.exports = router;
