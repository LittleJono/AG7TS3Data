var express = require('express')
var path = require("path")
var https = require('https');
var fs = require('fs');
var helmet = require('helmet')
var app = express()

app.use(helmet())

app.use(express.static('public'))

var listOfKeys = [];
var listOfUsers = [];
var tempList = [];

var Redis = require("ioredis");
var redis = new Redis({
    db: 1
});
// Create a readable stream (object mode)


var getKeys = function() {
    var promise = new Promise(function(resolve, reject) {
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
    redis.get(key).then(function(result) {
        tempList.push(JSON.parse(result));
    });
}


var sortstring = function (a, b)    {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

var test = function() {
    tempList = [];
    listOfKeys = listOfKeys.sort(sortstring);
    for (i in listOfKeys) {
        getUser(listOfKeys[i]);
    }
    setTimeout(function() {
        listOfUsers = tempList
    }, 2000)
}

getKeys().then(test);


setInterval(function() {
    getKeys().then(test);
}, 60000);


app.get('/information',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/informationdata', function (req, res) {
    res.send(listOfUsers)
});

app.get('/health-check', function (req, res) {
        res.sendStatus(200)
});


const options = {
    cert: fs.readFileSync('fullchain.pem'),
    key: fs.readFileSync('privkey.pem')
};


app.listen(3000);
https.createServer(options, app).listen(8443);