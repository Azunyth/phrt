var router = require('express').Router();

router.get('/', (req, res) => {
    req.db.collection('video').find((err, data) =>  {
        res.render('index.ejs');
    });
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;
    var videoFound = false;

    do {
        req.db.collection('videos').aggregate(    [ { $sample: { size: 1 } } ], function(err, video) {
            if('IFRAME' in video) {
                videoFound = true;
                var vid = { iframe: video.IFRAME }
                if(isAjax) {
                    res.json(vid);
                } else {
                    res.render('random.ejs', vid);
                }
            }
        });
    } while(!videoFound)

});

module.exports = router;
