const request = require('request');
const moment = require("moment");
const util = require("util");
const EventEmitter = require("events");


function Status(config, storage) {
    this.config = config;
    this.storage = storage;
    this.modified = null;
    this.fetch();

    setInterval(this.fetch.bind(this), config.fetch_every_min * 60000);
}


Status.prototype.fetch = function() {
    request({
        "url": this.config.url,
        "headers": {
            'If-Modified-Since': this.modified,
            'If-None-Match': this.etag
        }
    }, (err, res, body) => {
        if (err) return console.log(err);
        switch (res.statusCode) {
            case 200:
                var data = JSON.parse(body.trim().replace(/(\n|\r)+/g, '\\n'));
                console.log(data);
                data.modified = res.headers['last-modified'];
                data.etag = res.headers['etag'];
                var old_mod = moment(this.modified, "ddd, DD MMM YYYY HH:mm:ss Z");
                var new_mod = moment(data.modified, "ddd, DD MMM YYYY HH:mm:ss Z");
                if (!this.modified || old_mod.isBefore(new_mod)) {
                    this.new_status(data);
                    this.modified = data.modified;
                    this.etag = data.etag;
                }
                break;
            case 304:
                //console.log("Server Status: Not Modified");
                break;
            default:
                console.error("Server Status: Error");
        }
    });
};


Status.prototype.new_status = function(data) {
    console.log("New Status");
    if (data.status != this.storage.sto.serverstatus.status) {
        this.emit("status-change", this.format_status(data));
    }
    this.storage.sto.serverstatus = data;
    this.storage.save();
};


Status.prototype.get_status = function() {
    return this.format_status(this.storage.sto.serverstatus);
};


Status.prototype.format_status = function(status) {
    var status_msg = "Server Status: **" + status.status + "**";
    status_msg += "\n*" + status.message + "*";
    return status_msg;
};


util.inherits(Status, EventEmitter);
module.exports = Status;