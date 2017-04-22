var dotenv = require('dotenv');
var exphbs = require('express-handlebars');

module.exports = function(app) {
    var hbs = exphbs.create({
        defaultLayout: 'main',
        partialsDir: __dirname + '/../views/',
        layoutsDir: __dirname + '/../views/layouts',
        extname: '.hbs'
    });

    app.set('view engine', 'hbs');
    app.engine('hbs', hbs.engine);

    dotenv.config();
}
