function PostHandler() {
    var self = this;
    if (!(this instanceof PostHandler)) return new PostHandler();

    self.socket = io();
    self.map = Map();

    self.postQueue = [];
    self.shownPictures = [];
}