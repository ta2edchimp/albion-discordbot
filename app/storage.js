const fs = require('fs');
const savefile = "./storage/generated.json";


function Storage() {
    this.sto = {
        twitter: [],
        forum: [],
        guids: []
    };
    
    fs.access(savefile, fs.constants.F_OK, function(err) {
        if (err) return this.save();
        this.restore();
    }.bind(this));
}


Storage.prototype.set = function(name, channel_id) {
    var idx = this.sto[name].indexOf(channel_id);
    var msg = name + " notification enabled!";
    
    if(idx < 0) {
        this.sto[name].push(channel_id);
    } else {
        this.sto[name].splice(idx, 1);
        msg = name + " notification disabled!";
    }
    
    this.save();
    return msg;
};


Storage.prototype.restore = function() {
    fs.readFile(savefile, function(err, json) {
        if (err) return console.log("Storage (readFile): " + err);
        this.sto = JSON.parse(json);
    }.bind(this));
};


Storage.prototype.save = function() {
    fs.writeFile(savefile, JSON.stringify(this.sto, null, 4), function(err) {
        if (err) return console.log("Storage (writeFile): " + err);
    });
};


module.exports = Storage;