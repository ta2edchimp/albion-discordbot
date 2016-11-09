const fs = require('fs');
const savefile = "./storage/generated.json";
const util = require("util");
const EventEmitter = require("events");


function Storage() {
    this.sto = {
        serverstatus: {
            "status": "unknown",
            "message": "Unknown.",
            "modified": null
        },
        twitter: [],
        forum: [],
        guids: [],
        status: []
    };

    fs.access(savefile, fs.constants.F_OK, (err) => {
        if (err) return this.save();
        this.restore();
    });
}


Storage.prototype.set = function(name, channel_id) {
    var idx = this.sto[name].indexOf(channel_id);
    var msg = name + " notification enabled!";

    if (idx < 0) {
        this.sto[name].push(channel_id);
    }
    else {
        this.sto[name].splice(idx, 1);
        msg = name + " notification disabled!";
    }

    this.save();
    return msg;
};


Storage.prototype.restore = function() {
    fs.readFile(savefile, (err, json) => {
        if (err) return console.log("Storage (readFile): " + err);
        this.sto = JSON.parse(json);
        this.emit("ready");
    });
};


Storage.prototype.save = function() {
    fs.writeFile(savefile, JSON.stringify(this.sto, null, 4), (err) => {
        if (err) return console.log("Storage (writeFile): " + err);
    });
};


util.inherits(Storage, EventEmitter);
module.exports = Storage;