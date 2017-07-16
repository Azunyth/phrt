var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;
var Utils = require('../../../helpers/utils');

router.get('/:id', (req, res) => {
    var regObjId = /^[0-9a-fA-F]{24}$/;
    var id = req.params.id;

    if(regObjId.test(id)) {
        req.db.collection('datacontent').findOne({_id: ObjectId(id)}, function(err, video) {
            if(err) {
                return res.status(404).render('404.hbs');
            }
            var regQuote = /^\"(.*)\"$/;
            var cleanIframe = Utils.filterQuotes(video.IFRAME);

            res.render('random.hbs', {iframe: cleanIframe, id: video._id});
        })
    } else {
        res.status(404).render('404.hbs');
    }
});

router.get('/', (req, res) => {

    if(!req.query.tags || !req.query.tags.trim()) {
        return res.render('tags.hbs');
    }

    var tagsInReq = req.query.tags.trim();

    req.esclient.search({
        index: process.env.DB_NAME,
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
        var dataInView = { tags: tagsInReq };

        if(nbVideosFound > 0) {
            var rand = nbVideosFound == 0 ? 0 : Utils.random(0, nbVideosFound -1);

            dataInView.iframe = Utils.filterQuotes(data.hits.hits[rand]._source.IFRAME);
            dataInView.id = data.hits.hits[rand]._id;
        }

        return res.render('tags.hbs', dataInView);
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
                    var cleanIframe = Utils.filterQuotes(video.IFRAME);
                    return res.render('tags.hbs', { tags: tagsInReq, iframe: video.IFRAME, id: video._id });
                }

                res.render('tags.hbs', { tags: tagsInReq });
            });
    });


});

module.exports = router;
