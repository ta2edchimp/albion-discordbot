const Discordie = require("discordie");
const BotConfig = require("./config.json");
const Twitter = require("./app/twitter");
const Storage = require("./app/storage");
const Forum = require("./app/forum");
const fs = require('fs');

var twitter = new Twitter(BotConfig.twitter);
var storage = new Storage();
var forum = new Forum(BotConfig.forum, storage);
var client = new Discordie({
    autoReconnect: true
});


client.connect({
    "token": BotConfig.discord_token
});


client.Dispatcher.on(Discordie.Events.GATEWAY_READY, (e) => {
    console.log("Discord (ready): Username: " + client.User.username +
        ", Guilds: " + client.Guilds.length);
    client.User.setUsername(BotConfig.bot_name);
    client.User.setAvatar(fs.readFileSync("avatar.png"));
});


client.Dispatcher.on(Discordie.Events.DISCONNECTED, (e) => {
    console.log("Discord (disconnected): " + e.error);
});


client.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, (e) => {
    var permission = Discordie.Permissions.General.MANAGE_GUILD;
    var manager = e.message.author.can(permission, e.message.guild);
    var msg = e.message.resolveContent().toLowerCase();

    if (manager && msg.startsWith(BotConfig.bot_prefix)) {
        switch (msg.substr(BotConfig.bot_prefix.length)) {
            case "twitter":
                e.message.reply(storage.set("twitter", e.message.channel_id));
                break;
            case "forum":
                e.message.reply(storage.set("forum", e.message.channel_id));
                break;
            default:
                e.message.reply("unknown command!");
                break;
        }
    }
});


twitter.on("tweet", (link) => {
    console.log("Twitter: " + link);
    storage.sto.twitter.forEach((channel_id) => {
        var channel = client.Channels.get(channel_id);
        if(channel) channel.sendMessage(link);
    });
});


forum.on("thread", (item) => {
    console.log("Forum: " + item);
    storage.sto.twitter.forEach((channel_id) => {
        var channel = client.Channels.get(channel_id);
        if(channel) channel.sendMessage(item);
    });
})