const BotConfig = require("../config.json");
const API_GVG = require("./api_gvg.js");
const API_PVP = require("./api_pvp.js");
const API_TOP = require("./api_top.js");


function API() {
    this.valid_ranges = {
        "week": "week",
        "last-week": "lastWeek",
        "month": "month",
        "last-month": "last-month"
    };
}


API.prototype.handle_gvg = function(e, cmd) {
    var limit = 5;
    var input = parseInt(cmd[2], 10);
    if (input > 0 && input < 11) {
        limit = input;
    }
    switch (cmd[1]) {
        case "next":
            API_GVG.get_next(e, limit);
            break;
        case "last":
            API_GVG.get_last(e, limit);
            break;
        case "top":
            API_GVG.get_top(e);
            break;
        default:
            e.message.reply("__Usage__:" +
                "\Top 3 Upcoming GVG Matches: ``" + BotConfig.bot_prefix + " gvg top``" +
                "\nUpcoming GVG Matches: ``" + BotConfig.bot_prefix + " gvg next (1-10)` *(default: 5)*`" +
                "\nRecent GVG Matches: ``" + BotConfig.bot_prefix + " gvg last (1-10)`` *(default: 5)*");
    }
};


API.prototype.handle_pvp = function(e, cmd) {
    switch (cmd[1]) {
        case "last":
            var limit = 5;
            var input = parseInt(cmd[2], 10);
            if (input > 0 && input < 11) {
                limit = input;
            }
            API_PVP.get_last(e, limit);
            break;
        case "top":
            var range = this.valid_ranges[cmd[2]] ? this.valid_ranges[cmd[2]] : "week";
            API_PVP.get_top(e, range);
            break;
        default:
            e.message.reply("__Usage__:" +
                "\nTop PVP Kills: ``" + BotConfig.bot_prefix + " pvp top (week|last-week|month|last-month)`` *(default: week)*" +
                "\nRecent Kills: ``" + BotConfig.bot_prefix + " pvp last (1-10)`` *(default: 5)*");
    }
};


API.prototype.handle_top = function(e, cmd) {
    var range = this.valid_ranges[cmd[2]] ? this.valid_ranges[cmd[2]] : "week";
    switch (cmd[1]) {
        case "player":
            API_TOP.get_player(e, range);
            break;
        case "guild":
            API_TOP.get_guild(e, range);
            break;
        case "ratio":
            API_TOP.get_ratio(e);
            break;
        case "attacker":
            API_TOP.get_attacker(e, range);
            break;
        case "defender":
            API_TOP.get_defender(e, range);
            break;
        default:
            e.message.reply("__Usage__:" +
                "\nTop Kill Fame (Player): ``" + BotConfig.bot_prefix + " top player (week|last-week|month|last-month)`` *(default: week)*" +
                "\nTop Kill Fame (Guild): ``" + BotConfig.bot_prefix + " top guild (week|last-week|month|last-month)`` *(default: week)*" +
                "\nTop Kill Fame Ratio: ``" + BotConfig.bot_prefix + " top ratio``" +
                "\nGVG - Most Attacks Won: ``" + BotConfig.bot_prefix + " top attacker (week|last-week|month|last-month)`` *(default: week)*" +
                "\nGVG - Most Defenses Won: ``" + BotConfig.bot_prefix + " top defender (week|last-week|month|last-month)`` *(default: week)*");
    }
};


module.exports = new API();