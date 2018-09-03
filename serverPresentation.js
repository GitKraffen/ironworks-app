var ApplicationController = require('./serverApplication');
var Archiver = require('archiver');
var fs = require('fs');

//const path = require('path');
//let fs = require('fs');
const express = require('express'); // We will use express, for easier routing
//const app = express();
const bodyParser = require("body-parser");
//var zip = new require('node-zip')();*/

module.exports = class PresentationController {

    constructor(hostname, port) {
        this.hostname = hostname;
        this.port = port;
        this.app = express();
        this.resourcesPath = __dirname + '/public/';
        this.app.use(express.static('public'));
        this.app.use(bodyParser.urlencoded({extend: true})); //.json
        this.serverApp = new ApplicationController();
    }

    requestHandler() {
        debugger;
        this.app.post('/', (req, res) => res.sendFile(this.resourcesPath + 'index.html'));
        this.app.post('/compile', (req, res) => this.compileRequest(req, res));
        this.app.post('/export', (req, res) => this.exportRequest(req, res));
        this.app.use('/ee/:id', (req, res) => this.imageRequest(req, res));
        this.app.use("*", (req,res) => res.sendFile(this.resourcesPath + "404.html"));

    }

    compileRequest(req, res) {
        this.serverApp.requestCompile(req.body);
        let returnData = { success : true };
        res.send(returnData);
    }
    exportRequest(req, res) {
        let toReturn = this.serverApp.getZip(req.body.name, JSON.parse(req.body.data));
        let zip = Archiver('zip');
        res.header('Content-Disposition', 'attachment; filename="' + req.body.name + '.zip"');
        // Send the file to the page output.
        zip.pipe(res);
        // Create zip with some files. Two dynamic, one static. Put #2 in a sub folder.
        for(let key in toReturn) {
            zip.append(toReturn[key], {name: key});
        }
        zip.append(req.body.pro, {name: req.body.name + '.pro'});
        zip.finalize();

    }

    imageRequest(req, res) {
        var file = __dirname + '/public/image/ee' + req.params.id +'.lala';

        res.setHeader('Content-disposition', 'attachment; filename=ee'+ req.params.id +'.png');
        res.setHeader('Content-type', 'image/png');

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }

    startServer() {
        this.app.listen(this.port, this.hostname, () => console.log('Listening on: ' + this.hostname + ':' + this.port + '... CTRL+C to terminate'));
    }
}
