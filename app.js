var express = require('express');
var app = express();
var ph = require('pornhub');
var csv = require('csv');
var MongoClient = require('mongodb').MongoClient;
var db;
var url = "mongodb://localhost:27017/phrt";

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

MongoClient.connect(url, (err, database) => {
    console.log('Database conected');
    db = database;
})

app.get('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
            console.log("Connected successfully to server");
            db.collection('videos').aggregate(    [ { $sample: { size: 1 } } ], function(err, res) {
                    var keys = Object.keys(res[0]);
                    res.render('index.ejs', { iframe: res[0][keys[1]] });
            });
    });
});

app.listen(1337, () => {
    console.log("App running on http://localhost");
});                                                
