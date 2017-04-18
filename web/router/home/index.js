var router = require('express').Router();

router.get('/', (req, res) => {
    req.db.collection('video').find((err, data) =>  {
        res.render('index.ejs');
    });
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;

    res.json({iframe: "\"<iframe src='https://www.youporn.com/embed/11439983/gloryhole/' frameborder='0' height='481' width='608' scrolling='no' name='yp_embed_video'><a href='https://www.youporn.com/watch/11439983/gloryhole/'>Gloryhole!</a> powered by <a href='/'>YouPorn</a>.</iframe><br /><a href='https://www.youporn.com/watch/11439983/gloryhole/'>Gloryhole!</a> powered by <a href='/'>YouPorn</a>.\""});
    // req.db.collection('datacontent').aggregate([ { $sample: { size: 1 } } ]).nextObject(function(err, video) {
    //     var vid = { iframe: 'Oops error while getting video' };
    //     if('IFRAME' in video) {
    //         vid.iframe = video.IFRAME;
    //     }
    //
    //     if(isAjax) {
    //         res.json(vid);
    //     } else {
    //         res.render('random.ejs', vid);
    //     }
    //
    // });

});

module.exports = router;
