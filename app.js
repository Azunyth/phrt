var dotenv = require('dotenv');
var path = require('path');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var elasticsearch = require('elasticsearch');
require('./config')(app);
var url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;
var db;

MongoClient.connect(url, (err, database) => {
    if (err) throw err;

    db = database;

    app.listen(port, process.env.HOST, () => {
        console.log(`App running on port: ${port}`);
    });
});

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.use('/', (req, res, next) => {
    req.esclient = client;
    req.db = db;
    next();
})

app.use(express.static(__dirname + '/public'));
app.use('/', require('./web/router'));

app.all('*', (req, res) => {
    res.status(404).render('404.hbs');
});

var port = process.env.PORT || 1337;
