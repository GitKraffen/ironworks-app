'use strict'
let JavaGenerator = require('./classes/javaGenerator');
let SQLGenerator = require('./classes/sqlGenerator');
let XMLGenerator = require('./classes/xmlGenerator');
var Archiver = require('archiver');

let fs = require('fs');
let zip = new require('node-zip')();

module.exports = class ApplicationController {

    constructor(data) {
        this.rawData = 0;
    }
    requestCompile(data) {
        let javaG = new JavaGenerator();
        let sqlG = new SQLGenerator();
        let xmlG = new XMLGenerator();
        let javaFiles = javaG.generate(data);
        let sqlFiles = sqlG.generate(data);
        let xmlFiles = xmlG.generate(data);
        //TODO: compilazione
        let errors = false;
        return {'errors': errors};
    }

    getZip(data) {
        let javaG = new JavaGenerator();
        let sqlG = new SQLGenerator();
        let xmlG = new XMLGenerator();
        let javaFiles = javaG.generate(data);
        let sqlFiles = sqlG.generate(data);
        let xmlFiles = xmlG.generate(data);
        //return javaFiles;
        return {'java': javaFiles, 'sql': sqlFiles, 'xml': xmlFiles};
    }

    checkId(data) {

    }
}