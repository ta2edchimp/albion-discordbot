const request = require('request');
const moment = require('moment');
const util = require('util');

function API_GVG() {
    this.top_url = "https://gameinfo.albiononline.com/api/gameinfo/guildmatches/top";
    this.next_url = "https://gameinfo.albiononline.com/api/gameinfo/guildmatches/next";
    this.last_url = "https://gameinfo.albiononline.com/api/gameinfo/guildmatches/past";
    this.match_url = "https://albiononline.com/en/killboard/gvg/";
}


API_GVG.prototype.get_last = function(e, limit) {
    request(util.format("%s?limit=%d", this.last_url, limit), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var matches = JSON.parse(body);
            var msg = "\n**__Recent GVG Matches__**";
            matches.forEach((match) => {
                msg += "\n**";
                if (match.Attacker.Alliance) {
                    msg += util.format("[%s] - ", match.Attacker.Alliance.AllianceTag);
                }
                msg += util.format("%s (%d)** *vs.* **", match.Attacker.Name, match.AttackerTickets);
                if (match.Defender.Alliance) {
                    msg += util.format("[%s] - ", match.Defender.Alliance.AllianceTag);
                }
                msg += util.format("%s (%d)**\n*%s @ %s (%s)*\n``%s``\n",
                    match.Defender.Name, match.DefenderTickets, match.DefenderTerritory.Name,
                    moment(match.StartTime).utc().format("DD.MM.YYYY HH:mm z"),
                    moment(match.StartTime).fromNow(), this.match_url + match.MatchId);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Recent GVG Matches.");
    });
};


API_GVG.prototype.get_next = function(e, limit) {
    request(util.format("%s?limit=%d", this.next_url, limit), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var matches = JSON.parse(body);
            var msg = "\n**__Upcoming GVG Matches__**";
            matches.forEach((match) => {
                msg += "\n**";
                if (match.Attacker.Alliance) {
                    msg += util.format("[%s] - ", match.Attacker.Alliance.AllianceTag);
                }
                msg += util.format("%s** *vs.* **", match.Attacker.Name);
                if (match.Defender.Alliance) {
                    msg += util.format("[%s] - ", match.Defender.Alliance.AllianceTag);
                }
                msg += util.format("%s**\n*%s @ %s (%s)*\n``%s``\n",
                    match.Defender.Name, match.DefenderTerritory.Name,
                    moment(match.StartTime).utc().format("DD.MM.YYYY HH:mm z"),
                    moment(match.StartTime).fromNow(), this.match_url + match.MatchId);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Upcoming GVG Matches.");
    });
};


API_GVG.prototype.get_top = function(e) {
    request(this.top_url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var matches = JSON.parse(body);
            var msg = "\n**__Top 3 Upcoming GVG Matches__**";
            matches.forEach((match) => {
                msg += "\n**";
                if (match.Attacker.Alliance) {
                    msg += util.format("[%s] - ", match.Attacker.Alliance.AllianceTag);
                }
                msg += util.format("%s** *vs.* **", match.Attacker.Name);
                if (match.Defender.Alliance) {
                    msg += util.format("[%s] - ", match.Defender.Alliance.AllianceTag);
                }
                msg += util.format("%s**\n*%s @ %s (%s)*\n``%s``\n",
                    match.Defender.Name, match.DefenderTerritory.Name,
                    moment(match.StartTime).utc().format("DD.MM.YYYY HH:mm z"),
                    moment(match.StartTime).fromNow(), this.match_url + match.MatchId);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Top 3 Upcoming GVG Matches.");
    });
};


module.exports = new API_GVG();