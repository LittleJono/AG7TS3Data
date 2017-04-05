var request = require("request");
var Redis = require("ioredis");
var timestamps = new Redis({db: 0});
var users = new Redis({db: 1})
var time;
var DATA; 

var getFromTS = function() {
    var promise = new Promise(function(resolve, reject){
        request('https://gaming.aegis7.com/ts3php/json.php', function (error, response, body) {      
            DATA = body;
            time = Math.round((new Date).getTime() /60000);
            resolve("done");
        });
    });
    return promise;
};

function logData() {
    //console.log("Logged at " + time);
    timestamps.set(time, DATA);
    console.log(time);
};


function setUsers(index) {
    users.get(jsonData[index]["username"]).then(function (result) {
        //console.log(result);
        var toSet;
        result = JSON.parse(result); 
        if (result == null) {
            result = {
                user: jsonData[index]["username"],
                total: 1
            }
            result[jsonData[index]["channel"]] = 1;
            
        } else {
            result["total"] = result["total"] + 1
            if (result[jsonData[index]["channel"]] == undefined) {
                result[jsonData[index]["channel"]] = 1;
            } else {
                result[jsonData[index]["channel"]] = result[jsonData[index]["channel"]] + 1;
            }           
        }
        users.set(jsonData[index]["username"], JSON.stringify(result));
        console.log(result);
    });   
}

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

getFromTS().then(logData).then(processData);    
setInterval(function() {
    getFromTS().then(logData).then(processData);
}, 60000);