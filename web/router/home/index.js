var router = require('express').Router();

router.get('/', (req, res) => {
    // req.db.collection('video').find((err, data) =>  {
    //     console.log(data);
    //     res.render('index.ejs');
    // });
    
    req.db.collection('videos').aggregate(    [ { $sample: { size: 1 } } ], function(err, video) {
            var keys = Object.keys(video[0]);
            res.render('index.ejs', { iframe: video[0][keys[1]] });
    });
});

module.exports = router;
