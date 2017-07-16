var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;
var Utils = require('../../../helpers/utils');

router.use('/', require('./home'));
router.use('/watch', require('./watch'));
router.use('/guess', require('./guess'));

module.exports = router;
