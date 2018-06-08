const path = require('path');

var ServerPresentation = require('./serverPresentation');
let fs = require('fs');
const express = require('express'); // We will use express, for easier routing
//var session = require('express-session');
const app = express();
const bodyParser = require("body-parser");
var zip = new require('node-zip')();


/*app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'iwRocks'
}))*/

// We must set base server configs, like ip and port
const hostname = '127.0.0.1';
const port = 3000;
var resourcesPath = __dirname + '/public/';

// We will set a public folder for public resources called "public"
app.use(express.static('public'));

// Enable parser of json request
app.use(bodyParser.json());

sp = new ServerPresentation('127.0.0.1', 3000);
sp.startServer(hostname, port);
sp.requestHandler();

/*
// When user call homepage we will return our editor
app.get('/', (req, res) => res.sendFile(resourcesPath + 'index.html'));

// When user call compile request
app.get('/compile', function(req, res) {
    // Here we will compile all code just to verify if it's ok
    // [...]
    console.log(req.sessionID );
    res.status(200).send("compiled");
});

// When user call compile and save request
app.get('/export', function(req, res) {
    // Here we will compile all code into a zip
    // [...]
    res.status(200).send("exported");
});

app.use("*",function(req,res){
    res.sendFile(resourcesPath + "404.html");
});

// Start listening
app.listen(port, hostname, () => console.log('Listening on: ' + hostname + ':' + port + '... CTRL+C to terminate'));


/* ZIP */
/*
zip.file('test.txt', 'hello there');
var data = zip.generate({base64:false,compression:'DEFLATE'});
fs.writeFileSync('test.zip', data, 'binary');
*/