var request = require('request');


var Bots = function(key, id) {
    this.auth_key = key;
    this.bot_id = id;
};


Bots.prototype.update = function(server_count) {
    if (this.auth_key.length) {
        request({
            url: "https://bots.discord.pw/api/bots/" + this.bot_id + "/stats",
            method: "POST",
            headers: {
                'Authorization': this.auth_key
            },
            json: {
                server_count: server_count
            }
        }, function(error, response, body) {
            if (error) console.error("Request (error) %s", error);
            if (body.error) {
                console.error("Discord.pw (error): %s", body.error);
            }
            else if (body.stats) {
                console.log("Discord.pw (stats): Server Count %d",
                    body.stats[0].server_count);
            }
            else {
                console.error("Discord.pw: Unknown Error");
            }
        });
    }
};


module.exports = Bots;