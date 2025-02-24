var express = require('express');
var router = express.Router();

const ScribData = require('../src/popularScrib');


// router.get('/', function(req, res, next) {
//     res.render('index', {title})
// })

router.get('/', (req, res, next) => {
    res.render('homepage', {data: ScribData});
});

module.exports = router;