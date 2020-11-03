var express = require('express');
var router = express.Router();
const auth = require('../auth');
const { DB_URL, DB_NAME } = require('../constants');
var MongoClient = require('mongodb').MongoClient;

router.get('/login/username/:username/password/:password', (req, res) => {

    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection('admin').find().toArray((err, adminData) => {
            if (err) throw err;
            console.log(adminData)
            const { _id, username, password, } = adminData[0];
            if (req.params.username === username && req.params.password === password) {
                return res.status(200).json({ token: auth.generateAdminToken(_id) });
            }
            else return res.status(401).json({ message: 'Invalid username or password' });
        })
        db.close();  
    })
})

module.exports = router;