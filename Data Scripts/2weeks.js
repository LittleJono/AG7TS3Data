var request = require("request");
var Redis = require("ioredis");
var timestamps = new Redis({
    db: 0
});

var users = new Redis({
    db: 1
})

Get list of keys from past 2 weeks

For each key generate list of users and their corresponding channel

