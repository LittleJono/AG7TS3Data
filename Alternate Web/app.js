var express = require('express')
var path = require("path")
var https = require('https');
var fs = require('fs');
var helmet = require('helmet')
var app = express()
var basicAuth = require('express-basic-auth')


app.use(helmet())
app.set('json spaces', 2);

app.use(express.static('public'))

app.use(basicAuth({
    users: { 'ag7ts3logs': '#tinFoil1235' },
    challenge: true,
    realm: 'nothingtoseehere'
}))


app.get('/information',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/informationdata',function(req,res){
  res.sendFile(path.join(__dirname+'/informationdata.json'));
});


app.get('/health-check', function (req, res) {
        res.sendStatus(200)
});


const options = {
    cert: fs.readFileSync('./tls/fullchain.pem'),
    key: fs.readFileSync('./tls/privkey.pem')
};


app.listen(8080);
https.createServer(options, app).listen(8443);