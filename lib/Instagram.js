var Instagram = require("instagram-node-lib")
var config = require("config");
var request = require("request")
var querystr = require("querystring");

var instagram = {
    initializee: function() {
        Instagram.set("client_id", config.instagram.client_id);
        Instagram.set("client_secret", config.instagram.client_secret);
        Instagram.set("callback_url", config.root_url + "/ig/callback");
        Instagram.set("redirect_url", config.root_url);
        Instagram.subscriptions.unsubscribe_all({});
    },

    /**
     * Connects to Instagram server
     */
    handshake: function(req, res) {
        Instagram.subscriptions.handshake(req, res);
    },

    /**
     * Load feed for hashtag
     */
    suscribeByHashtag: function(hashTag) {
        Instagram.subscriptions.subscribe({
            object: "tag",
            object_id: hashTag,
            aspct: "media",
            callback_url: config.root_url + "ig/callback",
            type: "subscription",
            id: "#"
        });
        console.log("Subscribed to hashtag: " + hashTag);
    },

    /**
     * Load recent photos for hashtag
     */
    findRecentByHashtag: function(hashTag, callback) {
        console.log("Recent pictures for " + hashTag + " queried");
        Instagram.tags.recent({
            name: hashTag,
            complete: function(data) {
                console.log("Recent pictures for " + hashTag + " received");
                return callback(null, data);
            },
            error: function(errorMessage, errorObject, caller) {
                callback(errorObject, null);
            }
        });
    },

    /**
     * Reads in new data with the web socket
     */
    parseUpdateObjects: function(parseUpdateObjects, callback) {
        if (Object.prototype.toString.call(updateObjects) === "[object Array]") {
            updateObjects.forEach(function(tag) {
                if (tag.object_id != null) {
                    var hashTag = tag.object_id;
                    console.log("received update object for " + hashTah + " hashtag");
                    return callback(hashTag);
                }
            });
        }  
    },

    /**
     * Get pics with location tags for the visualization
     * 
     * @returns a stack of geotagged pictures
     */
    filterLocationPictures: function(pictures) {
        var locationPictures = []
        pictures.forEach(function(picture) {
            if (picture.location != null && picture.location.longitude &&  picture.location.latitude) {
                locationPictures.push(picture);
            }
        });
        return locationPictures
    },


}
module.exports = instagram;