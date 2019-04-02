var express = require('express');
var router = express.Router();

router.get('/use', function(req, res) {
    res.render('api', { title: 'Our ExpressJS API' });
});

module.exports = router;