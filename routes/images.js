var express = require('express');
var fs = require('fs');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var Binary = require('mongodb').Binary;
const formidable = require('formidable');
const { DB_URL, DB_NAME } = require('../constants');
const auth = require('../auth');

router.get('/getImage/:id', (req, res) => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    dbo.collection('images').find({ "_id": ObjectId(req.params.id) }).toArray((err, rawData) => {
      return res.status(200).send(rawData[0].image.buffer);
    })
  })
})

router.get('/getCountryImages/:id', (req, res) => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    dbo.collection("images").find({ "countryID": req.params.id }).toArray((err, imagesData) => {
      if (err) throw err;
      let images = [];
      imagesData.forEach(imageData => {
        images.push({ id: imageData._id, description: imageData.description });
      })
      db.close();
      return res.status(200).json(images);
    })
  });
})

router.post('/addImage', auth.requiresAdmin, (req, res) => {
  let form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err);
      throw err;
    }
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      const dbo = db.db(DB_NAME);
      let newImage = {
        countryID: fields.countryID,
        image: Binary(fs.readFileSync(files.image.path)),
        description: fields.description
      }
      dbo.collection('images').insertOne(newImage, (err, res) => {
        if (err) throw err;
      })
      db.close();
      return res.status(200).json({ message: 'Image added successfully' });
    })
  })
})

module.exports = router;
