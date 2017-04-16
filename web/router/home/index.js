var router = require('express').Router();

router.get('/', (req, res) => {
    req.db.collection('video').find((err, data) =>  {
        res.render('index.ejs');
    });
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;

    req.db.collection('datacontent').aggregate([ { $sample: { size: 1 } } ]).nextObject(function(err, video) {
        var vid = { iframe: 'Oops error while getting video' };
        if('IFRAME' in video) {
            vid.iframe = video.IFRAME;
        }
        
        if(isAjax) {
            res.json(vid);
        } else {
            res.render('random.ejs', vid);
        }

    });

});

module.exports = router;
