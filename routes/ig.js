var express = require('express');
var router = express.Router();
var config = require('config');
var instagram = require('../lib/Instagram');
var socket = require('../lib/SocketHelper');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 2000, true);

router.get('/callback', function(req, res) {
    instagram.handshake(req, res);
    res.end();
});

router.post('/callback', function(req, res) {
    var io = req.app.get('io');
    limiter.removeTokens(1, function(err, remainingRequests) {
        if (remainingRequests < 0) {
            res.status(429).send("Too many requests");
        } else {
            instagram.parseUpdateObjects(req.body, function(hashTag) {
                instagram.findRecentByHashtag(hashTag, function(error, results) {
                    if (error) {
                        console.log(error);
                    } else if (results.length) {
                        var locationPictures = instagram.filterLocationPictures(results);
                        io.sockets.to(hashTag).emit('msg', { posts: locationPictures });
                    }
                });
            });
        }
    });
    res.end();
});

