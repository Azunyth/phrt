var dotenv = require('dotenv');
var handlebars = require('handlebars');
var consolidate = require('consolidate');
var Utils = require('../helpers/utils');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app) {

    handlebars.registerPartial({
        'main': Utils.read(path.join(process.cwd(), 'views/layouts/main.hbs'))
    });

    var dayInMilliseconds = 5 * 1000;

    app.use(session({
        secret: 'qJiepTAlqDT34ZNHNI4xV5ZS2SsggUGw',
        resave: false,
        saveUninitialized: true,
        cookie: {
            //maxAge: dayInMilliseconds,
            //expires: new Date(Date.now() + dayInMilliseconds)
        }
    }))

    app.use(bodyParser.urlencoded({extended: false}));

    app.set('view engine', 'hbs');
    app.engine('hbs', consolidate.handlebars);

    dotenv.config();
}
