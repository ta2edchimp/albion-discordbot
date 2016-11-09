const Twit = require("twit");
const util = require("util");
const EventEmitter = require("events");


function Twitter(settings) {
    this.settings = settings;
    this.T = new Twit(settings);

    this.stream = this.T.stream("statuses/filter", {
        follow: settings.follow_ids
    });

    this.stream.on("tweet", (tweet) => {
        if (tweet.in_reply_to_user_id === null && tweet.retweeted_status === undefined) {
            var link = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
            this.emit("tweet", link);
        }
    });
    
    this.stream.on('disconnect', (disconnectMessage) => {
        console.log("Twit: " + disconnectMessage);
    });
}


Twitter.prototype.get_last = function(e, channel, args) {
    var params = {
        user_id: this.settings.follow_ids[0],
        count: 1,
        exclude_replies: true,
        include_rts: false,
        trim_user: true
    };
    this.T.get('statuses/user_timeline', params, (error, tweets, response) => {
        var tweet = false;
        if (!error && tweets.length) {
            tweet = "https://twitter.com/" + tweets[0].user.id_str + "/status/" + tweets[0].id_str;
        }
        e.message.reply(tweet?tweet:'twitter error!');
    });
};


util.inherits(Twitter, EventEmitter);
module.exports = Twitter;