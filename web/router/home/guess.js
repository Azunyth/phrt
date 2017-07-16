var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;
var Utils = require('../../../helpers/utils');

router.use('/*', (req, res, next) => {
    if(req.session.score === undefined) {
        req.session.score = 0;
    }

    next();
});

router.get('/', (req, res) => {



    req.esclient.search({
        index: process.env.DB_NAME,
          type: 'datacontent',
          body: {
              size: 100,
              query: {
                  function_score : {
                      query : {
                            regexp: {
                                TAGS: "[a-zA-Z]+"
                            }
                        },
                      random_score: {}
                  }
              }
          }
    }).then(function(data) {
        var nbVideosFound = data.hits.hits.length;
        var vid = { };

        if(nbVideosFound > 0) {
            var rand = nbVideosFound == 0 ? 0 : Utils.random(0, nbVideosFound -1);

            vid.iframe = Utils.filterQuotes(data.hits.hits[rand]._source.IFRAME);
            vid.tags = Utils.filterQuotes(data.hits.hits[rand]._source.TAGS);
            vid.id = data.hits.hits[rand]._id;
        }

        console.log(vid.tags);

        return res.render('guess.hbs', {video :vid, score: req.session.score});
    }, function(error){
        console.log(error);
        req.db.collection('datacontent').aggregate( [
                { $match : { TAGS: { $ne: "" } } },
                { $sample : { size: 1 } }
            ]).nextObject(function(err, video) {
            var vid = { iframe: 'Oops error while getting video', id:undefined };

            if('IFRAME' in video) {
                vid.iframe = Utils.filterQuotes(video.IFRAME);
                vid.id = video._id;

            } else {
                return res.redirect('/guess');
            }
            res.render('guess.hbs', {video :vid, score: req.session.score});
        });
    });



});

router.post('/tags', (req, res) => {
    var data = req.body;
    var id = data.videoSelected;
    var tagsStr = data.tags;
    var tags = tagsStr.split(',');

    var regObjId = /^[0-9a-fA-F]{24}$/;

    if(regObjId.test(id)) {
        req.db.collection('datacontent').findOne({_id: ObjectId(id)}, function(err, video) {
            if(err) {
                return res.status(404).render('404.hbs');
            }

            var videoTags = Utils.sanitize(video.TAGS.toLowerCase());


            for(var i = 0, len = tags.length; i < len; i++) {
                var regGuess = new RegExp("(?:^|\\W)"+tags[i].trim()+"(?=\\W|$)", "gi");

                console.log(regGuess);

                if(regGuess.test(videoTags)) {
                    console.log('ok');
                    req.session.score++;
                    videoTags = videoTags.replace(regGuess, '').trim();
                } else {
                    req.session.score--;
                }
            }

            res.redirect('/guess');
        })
    } else {
        res.status(404).render('404.hbs');
    }
});

module.exports = router;
