const util = require("util");
const EventEmitter = require("events");
const FeedParser = require('feedparser');
const request = require('request');


function Forum(config, storage) {
    this.config = config;
    this.storage = storage;
    this.fetch();
    
    setInterval(this.fetch.bind(this), config.fetch_every_min*60000);
}


Forum.prototype.fetch = function() {
    var _forum = this;
    
    this.config.feeds.forEach((url) => {
        var req = request(url);
        var feedparser = new FeedParser();

        req.on('error', (error) => {
            console.log("Request (error): " + error);
        });
        
        req.on('response', (res) => {
            var stream = req;
            if (res.statusCode != 200) {
                return req.emit('error', new Error('Bad status code'));
            }
            stream.pipe(feedparser);
        });

        feedparser.on('error', (error) =>{
            console.log("Feedparser (error): " + error);
        });
        
        feedparser.on('readable', () => {
            var item = null;

            while (item = feedparser.read()) {
                _forum.parse(item, feedparser.meta);
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


Forum.prototype.get_last = function() {
    return this.storage.sto.guids.slice(-1)[0];
};


util.inherits(Forum, EventEmitter);
module.exports = Forum;