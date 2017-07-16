var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;
var Utils = require('../../../helpers/utils');

router.get('/', (req, res) => {
    res.render('home.hbs');
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;

    req.db.collection('datacontent').aggregate([ { $sample: { size: 1 } } ]).nextObject(function(err, video) {
        var vid = { iframe: 'Oops error while getting video', id:undefined };
        if('IFRAME' in video) {
            vid.iframe = Utils.filterQuotes(video.IFRAME);
            vid.id = video._id;

        } else {
            return res.redirect("/");
        }

        if(isAjax) {
            res.json(vid);
        } else {
            res.render('random.hbs', vid);
        }

    });

});

module.exports = router;
