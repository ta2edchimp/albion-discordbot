const Discordie = require("discordie");
const BotConfig = require("./config.json");
const Bots = require("./app/bots");
const Status = require("./app/status");
const Twitter = require("./app/twitter");
const Storage = require("./app/storage");
const Forum = require("./app/forum");
const API = require("./app/api");
const fs = require('fs');

var twitter = new Twitter(BotConfig.twitter);
var storage = new Storage();
var status = null;
var forum = null;
var stats = null;


storage.on("ready", () => {
    status = new Status(BotConfig.serverstatus, storage);
    status.on("status-change", (status) => {
        console.log("New " + status);
        storage.sto.status.forEach((channel_id) => {
            var channel = client.Channels.get(channel_id);
            if (channel) channel.sendMessage("New " + status);
        });
    });

    forum = new Forum(BotConfig.forum, storage);
    forum.on("thread", (item) => {
        console.log("Forum: " + item);
        storage.sto.twitter.forEach((channel_id) => {
            var channel = client.Channels.get(channel_id);
            if (channel) channel.sendMessage(item);
        });
    });
});


var client = new Discordie({
    autoReconnect: true
});


client.connect({
    "token": BotConfig.discord_token
});


client.Dispatcher.on("DISCONNECTED", (e) => {
    console.error("Discord (DISCONNECTED): " + e.error);
});


client.Dispatcher.on("GATEWAY_RESUMED", (e) => {
    console.log("Discord (GATEWAY_RESUMED)");
    client.User.setStatus(null, "Usage: " + BotConfig.bot_prefix);
});


client.Dispatcher.on("GATEWAY_READY", (e) => {
    stats = new Bots(BotConfig.discord_pw_key, client.User.id);
    console.log("Discord (ready): Username: " + client.User.username +
        ", Guilds: " + client.Guilds.length);
    stats.update(client.Guilds.length);
    client.User.setUsername(BotConfig.bot_name);
    client.User.setAvatar(fs.readFileSync("avatar.png"));
    client.User.setStatus(null, "Usage: " + BotConfig.bot_prefix);
});


client.Dispatcher.on("GUILD_CREATE", (e) => {
    stats.update(client.Guilds.length);
});


client.Dispatcher.on("MESSAGE_CREATE", (e) => {
    var permission = Discordie.Permissions.General.MANAGE_GUILD;
    var manager = false;
    var msg = e.message.resolveContent().toLowerCase();
    if (e.message.member && e.message.member.can(permission, e.message.guild)) {
        manager = true;
    }

    if (msg.startsWith(BotConfig.bot_prefix)) {
        var cmd = msg.substr(BotConfig.bot_prefix.length).trim().split(' ');
        switch (cmd[0]) {
            case "toggle-twitter":
                if (manager) e.message.reply(storage.set("twitter", e.message.channel_id));
                break;
            case "toggle-news":
                if (manager) e.message.reply(storage.set("forum", e.message.channel_id));
                break;
            case "toggle-status":
                if (manager) e.message.reply(storage.set("status", e.message.channel_id));
                break;
            case "status":
                if (status) e.message.reply(status.get_status());
                break;
            case "news":
                if (forum) e.message.reply(forum.get_last());
                break;
            case "twitter":
                twitter.get_last(e);
                break;
            case "help":
                e.message.reply(get_help(manager));
                break;
            case "gvg":
                API.handle_gvg(e, cmd);
                break;
            case "pvp":
                API.handle_pvp(e, cmd);
                break;
            case "top":
                API.handle_top(e, cmd);
                break;
            default:
                e.message.reply("Unknown Command! Try ``" + BotConfig.bot_prefix + " help``.");
                break;
        }
    }
});


function get_help(manager) {
    var help_msg = "\n__Common Commands__" +
        "\n**" + BotConfig.bot_prefix + " status** - Show Server Status" +
        "\n**" + BotConfig.bot_prefix + " news** - Get the latest News" +
        "\n**" + BotConfig.bot_prefix + " twitter** - Get the latest Tweet" +
        "\n**" + BotConfig.bot_prefix + " gvg** - Show GvG Matches" +
        "\n**" + BotConfig.bot_prefix + " pvp** - Show PvP Kills" +
        "\n**" + BotConfig.bot_prefix + " top** - Show Leaderboard";
        
    if (manager) {
        help_msg += "\n\n__Admin Commands__" +
            "\n**" + BotConfig.bot_prefix + " toggle-status** - En-/Disable Server Status Notifications" +
            "\n**" + BotConfig.bot_prefix + " toggle-news** - En-/Disable News Notifications" +
            "\n**" + BotConfig.bot_prefix + " toggle-twitter** - En-/Disable Twitter Notifications";
    }
    return help_msg;
}


twitter.on("tweet", (link) => {
    console.log("Twitter: " + link);
    storage.sto.twitter.forEach((channel_id) => {
        var channel = client.Channels.get(channel_id);
        if (channel) channel.sendMessage(link);
    });
});
