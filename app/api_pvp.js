const numeral = require('numeral');
const request = require('request');
const moment = require('moment');
const util = require('util');


function API_PVP() {
    this.top_url = "https://gameinfo.albiononline.com/api/gameinfo/events/killfame?limit=5";
    this.last_url = "https://gameinfo.albiononline.com/api/gameinfo/events";
    this.killboard_url = "https://albiononline.com/en/killboard/kill/";
}


API_PVP.prototype.get_last = function(e, limit) {
    request(util.format("%s?limit=%d", this.last_url, limit), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var kills = JSON.parse(body);
            var msg = "\n**__Recent Kills__**";
            kills.forEach((kill) => {
                msg += util.format("\n**%s**", kill.Killer.Name);
                if(kill.Killer.GuildName) {
                    var kalliance = "";
                    if(kill.Killer.AllianceName) {
                        kalliance = util.format("[%s] - ", kill.Killer.AllianceName);
                    }
                    msg += util.format(" (%s)", kalliance + kill.Killer.GuildName);
                }
                msg += util.format(" *killed*  **%s**", kill.Victim.Name);
                if(kill.Victim.GuildName) {
                    var valliance = "";
                    if(kill.Victim.AllianceName) {
                        valliance = util.format("[%s] - ", kill.Victim.AllianceName);
                    }
                    msg += util.format(" (%s)", valliance + kill.Victim.GuildName);
                }
                msg += util.format("\n%s: %s Fame *@ %s (%s)*\n``%s``\n", 
                    kill.GvGMatch ? "GvG" : "PvP",
                    numeral(kill.TotalVictimKillFame).format('0.00a'), 
                    moment(kill.TimeStamp).format("HH:mm:ss"), 
                    moment(kill.TimeStamp).fromNow(),
                    this.killboard_url + kill.BattleId);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Recent Kills.");
    });
};


API_PVP.prototype.get_top = function(e, range) {
    request(util.format("%s&range=%d", this.top_url, range), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var kills = JSON.parse(body);
            var msg = util.format("\n**__Top PVP Kills__** *(%s)*", range);
            kills.forEach((kill) => {
                msg += util.format("\n**%s**", kill.Killer.Name);
                if(kill.Killer.GuildName) {
                    var kalliance = "";
                    if(kill.Killer.AllianceName) {
                        kalliance = util.format("[%s] - ", kill.Killer.AllianceName);
                    }
                    msg += util.format(" (%s)", kalliance + kill.Killer.GuildName);
                }
                msg += util.format(" *killed*  **%s**", kill.Victim.Name);
                if(kill.Victim.GuildName) {
                    var valliance = "";
                    if(kill.Victim.AllianceName) {
                        valliance = util.format("[%s] - ", kill.Victim.AllianceName);
                    }
                    msg += util.format(" (%s)", valliance + kill.Victim.GuildName);
                }
                msg += util.format("\n%s: %s Fame *@ %s (%s)*\n ``%s``\n", 
                    kill.GvGMatch ? "GvG" : "PvP",
                    numeral(kill.TotalVictimKillFame).format('0.00a'), 
                    moment(kill.TimeStamp).format("HH:mm:ss"), 
                    moment(kill.TimeStamp).fromNow(),
                    this.killboard_url + kill.BattleId);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Top PVP Kills.");
    });
};

module.exports = new API_PVP();