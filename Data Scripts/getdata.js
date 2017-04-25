var Redis = require("ioredis");
var redis = new Redis({
    db: 1
});
// Create a readable stream (object mode)
var stream = redis.scanStream();
var keys = [];
var fs = require('fs');

stream.on('data', function (resultKeys) {
    // `resultKeys` is an array of strings representing key names
    for (var i = 0; i < resultKeys.length; i++) {
        keys.push(resultKeys[i]);
    }
});
stream.on('end', function () {
    //console.log('done with the keys: ', keys.sort());
    keys = keys.sort();
    for (i in keys) {
        redis.get(keys[i]).then(function (result) {
            fs.appendFile('data.txt', result + "\r\n", function (err) {
                if (err) throw err;
            });
        });
    }
});
