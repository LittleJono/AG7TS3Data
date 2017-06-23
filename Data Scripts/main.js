var request = require("request");
var Redis = require("ioredis");
var timestamps = new Redis({
    db: 0
});
var users = new Redis({
    db: 1
})
//Time in epoch format
var time;
//JSON from aegis7
var DATA;
//List of people and their corresponding channel to be used to determine who they have been in contact with
var userchannel = {};

//Get DATA from aegis7
var getFromTS = function () {
    var promise = new Promise(function (resolve, reject) {
        request('https://gaming.aegis7.com/ts3php/json.php', function (error, response, body) {
            DATA = body;
            time = Math.round((new Date).getTime() / 60000);
            resolve("done");
        });
    });
    return promise;
};

//Log a copy of DATA in the DB
function logData() {
    //console.log("Logged at " + time);
    timestamps.set(time, DATA);
    console.log(time);
};

//Determine what users are in what channel and store in userchannel
var proccessUsers = function () {
    var promise = new Promise(function (resolve, reject) {
        jsonData2 = JSON.parse(DATA);
        jsonData2 = jsonData2["clients"];
        userchannel = {};
        for(i = 0; i<=jsonData2.length; i++) {
            if (i==jsonData2.length) {
                console.log(userchannel);
                resolve("done");
            } else {
                userchannel[jsonData2[i]["uuid"]] = jsonData2[i]["channel"];
            };
        };
    });
    return promise;
};


//Setting User data in the second DB
function setUsers(index) {
    users.get(jsonData[index]["uuid"]).then(function (result) {
        //console.log(result);
        var toSet;
        result = JSON.parse(result);
        
        var contacted = [];
        var channel = jsonData[index]["channel"];
        for (var key in userchannel) {
            if (key != jsonData[index]["uuid"]) {
                if (userchannel[key] == channel) {
                    contacted.push(key);
                };
            };
        }
        
        if (result == null) {
            result = {
                uuid: jsonData[index]["uuid"],
                knownnames: {},
                lastknownname: jsonData[index]["username"],
                alltime:{
                    total: 1,
                    incontact:{}
                }
            }
            result.alltime[jsonData[index]["channel"]] = 1;
            for (person in contacted) {
                result.alltime.incontact[contacted[person]] = 1;
            }
            result.knownnames[jsonData[index]["username"]] = 1;

        } else {
            result.alltime["total"] = result.alltime["total"] + 1
            if (result.alltime[jsonData[index]["channel"]] == undefined) {
                result.alltime[jsonData[index]["channel"]] = 1;
            } else {
                result.alltime[jsonData[index]["channel"]] = result.alltime[jsonData[index]["channel"]] + 1;
            }
            for (person in contacted) {
                if (result.alltime.incontact[contacted[person]] == undefined) {
                     result.alltime.incontact[contacted[person]] = 1;
                } else {
                    result.alltime.incontact[contacted[person]] += 1;
                }
            }   
            result.knownnames[jsonData[index]["username"]] = 1;
            result.lastknownname = jsonData[index]["username"];
        }
        users.set(jsonData[index]["uuid"], JSON.stringify(result));
        console.log(result);
    });
}



//Runs setUsers async for every user currently connected to TS
function processData() {
    jsonData = JSON.parse(DATA);
    jsonData = jsonData["clients"]
    //console.log(jsonData)
    //console.log(jsonData.length);
    console.log("-----------------------------------------------")
    console.log("-----------------------------------------------")
    console.log("-----------------------------------------------")

    for (i in jsonData) {
        setUsers(i);
    }
};

//Run instantly then once every 60 seconds.
getFromTS().then(proccessUsers).then(logData).then(processData);
setInterval(function () {
    getFromTS().then(proccessUsers).then(logData).then(processData);
}, 60000);
