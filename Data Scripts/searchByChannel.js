var fs = require('fs');

var listOfKeys = [];
var listOfUsers = [];
var PUBGPlayers = {};

var Redis = require("ioredis");
var redis = new Redis({
    db: 1
});
// Create a readable stream (object mode)

var getKeys = function () {
    var promise = new Promise(function (resolve, reject) {
        var stream = redis.scanStream();
        var keys = [];

        stream.on('data', function (resultKeys) {
            // `resultKeys` is an array of strings representing key names
            for (var i = 0; i < resultKeys.length; i++) {
                keys.push(resultKeys[i]);
            }
        });
        stream.on('end', function () {
            listOfKeys = keys
            resolve();
        })
    })
    return promise;
};

function getUser(key) {
    redis.get(key).then(function (result) {
        result = JSON.parse(result)
        for (channel in result.alltime) {
            if ((channel).toString().toLowerCase().slice(0, 6).valueOf() == "player".valueOf()) {
                if (!(result.user in PUBGPlayers)) {
                PUBGPlayers[result.user] = {}
            }
                PUBGPlayers[result.user][channel] = result.alltime[channel]
            } else if ((channel).toString().toLowerCase().slice(0, 4).valueOf() == "pubg".valueOf()) {
                if (!(result.user in PUBGPlayers)) {
                PUBGPlayers[result.user] = {}
            }
                PUBGPlayers[result.user][channel] = result.alltime[channel]
            } else {
                continue
            }
        }
    });
}

var sortstring = function (a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

var test = function () {
    listOfKeys = listOfKeys.sort(sortstring);
    for (i = 0; i < (listOfKeys.length - 1); i = i + 1) {
        getUser(listOfKeys[i]);
    }
}

getKeys().then(test);
setTimeout(function() {
    console.log(PUBGPlayers)
}, 10000)