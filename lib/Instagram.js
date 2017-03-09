var Instagram = require("instagram-node-lib")
var config = require("config");
var request = require("request")
var querystr = require("querystring");

var instagram = {
    initializee: function() {
        Instagram.set("client_id", config.instagram.client_id);
        Instagram.set("client_secret", config.instagram.client_secret);

        Instagram.subscriptions.unsubscribe_all({});
    }
}