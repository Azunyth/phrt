var dotenv = require('dotenv');
var path = require('path');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
require('./config');
var url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
            db.collection('videos').aggregate(    [ { $sample: { size: 1 } } ], function(err, video) {
                    var keys = Object.keys(video[0]);
                    res.render('index.ejs', { iframe: video[0][keys[1]] });
            });
    });
});

app.all('*', (req, res) => {
    res.status(404).render('404.ejs');
});

var port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`App running on port: ${port}`);
});
