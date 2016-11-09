const numeral = require('numeral');
const request = require('request');
const util = require('util');


function API_TOP() {
    this.player_url = "https://gameinfo.albiononline.com/api/gameinfo/events/playerfame?&limit=10";
    this.guild_url = "https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?limit=10";
    this.ratio_url = "https://gameinfo.albiononline.com/api/gameinfo/players/fameratio?limit=10";
    this.attacker_url = "https://gameinfo.albiononline.com/api/gameinfo/guilds/topguildsbyattacks?limit=10";
    this.defender_url = "https://gameinfo.albiononline.com/api/gameinfo/guilds/topguildsbydefenses?limit=10";
    this.killboard_url = "https://albiononline.com/en/killboard/";
}


API_TOP.prototype.get_player = function(e, range) {
    request(util.format("%s&range=%s", this.player_url, range), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var players = JSON.parse(body);
            var msg = util.format("\n**__Top Kill Fame (Player)__** *(%s)*", range);
            players.forEach((player, i) => {
                msg += util.format("\n**%d. %s**", i+1, player.Name);
                if(player.GuildName) {
                    var palliance = "";
                    if(player.AllianceName) {
                        palliance = util.format("[%s] - ", player.AllianceName);
                    }
                    msg += util.format(" (%s)", palliance + player.GuildName);
                }
                msg += util.format(": *%s Fame*\n``%splayer/%s``",
                    numeral(player.KillFame).format('0.00a'),
                    this.killboard_url, player.Id);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Top Kill Fame (Player).");
    });
};


API_TOP.prototype.get_guild = function(e, range) {
    request(util.format("%s&range=%s", this.guild_url, range), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var guilds = JSON.parse(body);
            var msg = util.format("\n**__Top Kill Fame (Guild)__** *(%s)*", range);
            guilds.forEach((guild, i) => {
                msg += util.format("\n**%d. %s**", i+1, guild.Name);
                msg += util.format(": *%s Fame*\n``%sguild/%s``",
                    numeral(guild.KillFame).format('0.00a'),
                    this.killboard_url, guild.Id);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Top Kill Fame (Guild).");
    });
};


API_TOP.prototype.get_ratio = function(e) {
    request(this.ratio_url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var players = JSON.parse(body);
            var msg = "\n**__Top Kill Fame Ratio__**";
            players.forEach((player, i) => {
                msg += util.format("\n**%d. %s**", i+1, player.Name);
                if(player.GuildName) {
                    var palliance = "";
                    if(player.AllianceName) {
                        palliance = util.format("[%s] - ", player.AllianceName);
                    }
                    msg += util.format(" (%s)", palliance + player.GuildName);
                }
                msg += util.format(": *%s Fame*\n``%splayer/%s``",
                    numeral(player.KillFame).format('0.00a'),
                    this.killboard_url, player.Id);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Top Kill Fame Ratio.");
    });
};


API_TOP.prototype.get_attacker = function(e, range) {
    request(util.format("%s&range=%s", this.attacker_url, range), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var guilds = JSON.parse(body);
            var msg = util.format("\n**__GVG - Most Attacks Won__** *(%s)*", range);
            guilds.forEach((guild, i) => {
                msg += util.format("\n**%d. %s**", i+1, guild.Name);
                msg += util.format(": *%d Attacks Won*\n``%sguild/%s``",
                    guild.AttacksWon, this.killboard_url, guild.Id);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive Upcoming GVG Matches.");
    });
};


API_TOP.prototype.get_defender = function(e, range) {
    request(util.format("%s&range=%s", this.defender_url, range), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var guilds = JSON.parse(body);
            var msg = util.format("\n**__GVG - Most Defenses Won__** *(%s)*", range);
            guilds.forEach((guild, i) => {
                msg += util.format("\n**%d. %s**", i+1, guild.Name);
                msg += util.format(": *%d Defenses Won*\n``%sguild/%s``",
                    guild.DefensesWon, this.killboard_url, guild.Id);
            });
            return e.message.reply(msg);
        }
        return e.message.reply("Unable to receive GVG - Most Defenses Won.");
    });
};


module.exports = new API_TOP();