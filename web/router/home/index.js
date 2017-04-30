var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;
var Utils = require('../../../helpers/utils');

router.get('/', (req, res) => {
    req.db.collection('video').find((err, data) =>  {
        res.render('home.hbs');
    });
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;

    req.db.collection('datacontent').aggregate([ { $sample: { size: 1 } } ]).nextObject(function(err, video) {
        var vid = { iframe: 'Oops error while getting video', id:undefined };
        if('IFRAME' in video) {
            vid.iframe = video.IFRAME;
            vid.id = video._id;
        }

        if(isAjax) {
            res.json(vid);
        } else {
            res.render('random.hbs', vid);
        }

    });

});

router.get('/watch/:id', (req, res) => {
    var regObjId = /^[0-9a-fA-F]{24}$/;
    var id = req.params.id;

    if(regObjId.test(id)) {
        req.db.collection('datacontent').findOne({_id: ObjectId(id)}, function(err, video) {
            if(err) {
                return res.status(404).render('404.hbs');
            }

            res.render('random.hbs', {iframe: video.IFRAME, id: video._id});
        })
    } else {
        res.status(404).render('404.hbs');
    }
});

router.get('/watch', (req, res) => {

    if(!req.query.tags || !req.query.tags.trim()) {
        return res.render('tags.hbs');
    }

    var tagsInReq = req.query.tags.trim();

    req.esclient.search({
        index: 'phrt',
          type: 'datacontent',
          body: {
              size: 30,
              query: {
                  function_score : {
                      query : {
                            match: {
                                TAGS: {
                                    query: tagsInReq,
                                    minimum_should_match: "1<-25% "
                                }
                            }
                        },
                      random_score: {}
                  }
              }
          }
    }).then(function(data) {
        var nbVideosFound = data.hits.hits.length;
        if(data.hits.total > 0) {
            var rand = nbVideosFound == 0 ? 0 : Utils.random(0, nbVideosFound -1);

            return res.render('tags.hbs', { tags: tagsInReq, iframe: data.hits.hits[rand]._source.IFRAME, id: data.hits.hits[rand]._id });
        } else {
            return res.render('tags.hbs', { tags: tagsInReq });
        }
    }, function(error){
        var tags = tagsInReq.split(' ').map((tag) => {
            return { TAGS: { '$regex' : tag, '$options' : 'i' } }
        });
        req.db
            .collection('datacontent')
            .aggregate( [
                { $match: { $and: tags } },
                { $sample : { size: 1 } }
            ]).nextObject(function(err, video) {
                if(video) {
                    return res.render('tags.hbs', { tags: tagsInReq, iframe: video.IFRAME, id: video._id });
                }

                res.render('tags.hbs', { tags: tagsInReq });
            });
    });


});

module.exports = router;
