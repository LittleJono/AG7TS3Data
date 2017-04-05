var Redis = require("ioredis");
var redis = new Redis({db: 0});
// Create a readable stream (object mode)
var stream = redis.scanStream();
var keys = [];
stream.on('data', function (resultKeys) {
  // `resultKeys` is an array of strings representing key names
  for (var i = 0; i < resultKeys.length; i++) {
    keys.push(resultKeys[i]);
  }
});
stream.on('end', function () {
  console.log('done with the keys: ', keys);
});