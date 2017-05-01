var dotenv = require('dotenv');
var path = require('path');
var sitemap = require('express-sitemap');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var elasticsearch = require('elasticsearch');
require('./config')(app);
var url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;
var db;
var port = process.env.PORT || 1337;

MongoClient.connect(url, (err, database) => {
    if (err) throw err;

    db = database;

    app.listen(port, process.env.HOST, () => {
        console.log(`App running on port: ${port}`);
    });
});

var client = new elasticsearch.Client({
  host: process.env.ES_HOST + ':' + process.env.ES_PORT
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

// var sm = sitemap({
//   http: 'http',
//   url: 'faproulette.win',
//   sitemap: 'public/sitemap.xml',
//   robots: 'public/robots.txt',
//   sitemapSubmission: '/sitemap.xml',
//   route: {
//       '/watch/:id' : {
//           hide: true
//       },
//       '*' : {
//           hide: true
//       }
//   }
// });
// sm.generate(app, ['/']);
// sm.toFile();
