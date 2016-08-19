const util = require("util");
const EventEmitter = require("events");
const FeedParser = require('feedparser');
const request = require('request');


function Forum(config, storage) {
    this.config = config;
    this.storage = storage;
    setInterval(this.fetch.bind(this), config.fetch_every_min*60000);
}


Forum.prototype.fetch = function() {
    var _forum = this;
    
    this.config.feeds.forEach(function(url) {
        var req = request(url);
        var feedparser = new FeedParser();

        req.on('error', function(error) {
            console.log("Request (error): " + error);
        });
        
        req.on('response', function(res) {
            var stream = this;
            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
            stream.pipe(feedparser);
        });

        feedparser.on('error', function(error) {
            console.log("Feedparser (error): " + error);
        });
        
        feedparser.on('readable', function() {
            var stream = this;
            var meta = this.meta;
            var item = null;

            while (item = stream.read()) {
                _forum.parse(item, meta);
            }
            
            _forum.storage.save();
        });
    });
};


Forum.prototype.parse = function(item, meta) {
    var exists = this.storage.sto.guids.indexOf(item.guid);
    
    if(exists < 0) {
        this.storage.sto.guids.push(item.guid);
        var msg = "__" + meta.title + "__:\n" + item.link;
        this.emit("thread", msg);
    }
};


util.inherits(Forum, EventEmitter);
module.exports = Forum;