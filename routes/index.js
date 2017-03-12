var express = require('express');
var router = express.Router();
var world = require('../maps/world-50m.json');

router.get('/', function(req, res) {
    res.render('index', { title: '#realtimeart' });
});

router.get('/world-50m', function(req, res) {
    res.json(world);
})

module.exports = router;