const Twit = require("twit");
const util = require("util");
const EventEmitter = require("events");


function Twitter(settings) {
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


util.inherits(Twitter, EventEmitter);
module.exports = Twitter;