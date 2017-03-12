function PostHandler() {
    var self = this;
    if (!(this instanceof PostHandler)) return new PostHandler();

    self.socket = io();
    self.map = Map();

    self.postQueue = [];
    self.shownPictures = [];
}

PostHandler.prototype.start = function() {
    var self = this;
    
    self.bindSearchForms();
    self.map.render();
    self.isUpdating = false;

    self.socket.on("msg", self.handleIncomingPosts.bind(self));
    setInterval(self.performStep.bind(self), 5500);
}

PostHandler.prototype.handleIncomingPosts = function(data) {
    var self = this;
    self.isUpdating = true;

    data.posts.forEach(function(post) {
        if (self.shownPictures.indexOf(post.id) === -1) {
            var parsedPost = self.parse(post);
            self.shownPictures.push(post.id);
            self.postsQueue.push(parsedPost);
            self.cachePicture(parsedPost.pictureUrl);
        }
    })
}

PostHandler.prototype.parse = function(post) {
    var postObject = {
        location: [post.location.longtitude, post.location.latitude],
        pictureUrl: post.images.low_resolution.url.replace("https://", "//"),
        postUrl: post.link.replace("https://", "//"),
        caption: ""
    }
    if (post.caption != null) {
        postObject.caption = post.caption.text
    }
    return postObject;
}

PostHandler.prototype.performStep = function() {
    var self = this;
    if (self.postQueue.length) {
        self.noPicturesStepCount = 0;
        post = self.postQueue.shift();

        self.map.removeMarker();
        self.map.step(post.location, function() {
            self.map.addPicture(post.pictureUrl, post.postUrl);
            self.map.drawMarker(post.location);
            self.map.getLocation(post.location);
            self.map.replaceCaption(post.caption);
        })
    } else {
        if (self.isUpdating) {
            self.noPicturesStepCount++;
            if (self.noPicturesStepCount == 5) {
                self.isUpdating = false;
                SiteEvents.showModal("Not enough pictures with your hashtag right now. Try a different one?");
            }
        }
    }
}

PostHandler.prototype.bindSearchForms = function() {
    var self = this;

    $(".hash-tag-form").submit(function(evt) {
        var data = $(this).serialize();
        var inputtedHashTag = $(this).find('input[name="hash_tag"]').val();
        var regex = new RegExp("^[a-zA-Z0-9_-]+$");
        if (!regex.test(inputtedHashTag)) {
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/ig/subscribe",
            data: data,
            params: data,
            success: function(recentPictures) {
                self.postQueue = [];
                self.shownPictures = [];
                self.handleIncomingPosts({ posts: recentPictures });
                self.socket.emit("subscribe", inputtedHashTag);
                SiteEvents.submitHashTag(inputtedHashTag);
            },
            error: function(request, status, error) {
                SiteEvetnts.showModal(request.responseText);
            }
        });
        return false;
    });
}

PostHandler.prototype.cachePicture = function(pictureUrl) {
    var img = new Image();
    img.src = pictureUrl;
}

