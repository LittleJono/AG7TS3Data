var fs = require('fs');
var client =  require('scp2');

var listOfKeys = [];
var listOfUsers = [];

var Redis = require("ioredis");
var redis = new Redis({
    db: 1
});
// Create a readable stream (object mode)

var toAddJSON = [];

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
            toAddJSON.push(JSON.parse(result));
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
    toAddJSON = [];
    listOfKeys = listOfKeys.sort(sortstring);
    for (i = 0; i < (listOfKeys.length - 1); i = i + 1) {
        getUser(listOfKeys[i]);
    }

    setTimeout(function () {
        console.log("Done");
        var finishedJson = {};
        finishedJson["users"] = toAddJSON;
        fs.writeFile('informationdata.json', JSON.stringify(finishedJson, null, 4));
        client.scp('informationdata.json', {
            host: 'www.jonoweb.me',
            username: 'jono',
            privateKey: require("fs").readFileSync('newKey'),
            passphrase: 'private_key_password',
            path: '/home/jono/Web/'
        }, function(err) {
            console.log(err)
            console.log("done")
        })
    }, 5000)
}

getKeys().then(test);

setInterval(function() {
    getKeys().then(test);
}, 300000);
