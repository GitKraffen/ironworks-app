'use strict';
let JavaGenerator = require('./classes/javaGenerator');
let SQLGenerator = require('./classes/sqlGenerator');
let JMGenerator = require('./classes/javaManagerGenerator');
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
        let jmG = new JMGenerator();
        let javaFiles = javaG.generate(data);
        let sqlFiles = sqlG.generate(data);
        let jmFiles = jmG.generate(data);
        //TODO: compilazione
        let errors = false;
        return {'errors': errors};
    }

    getZip(name, data) {
        this.setNames(data);
        let javaG = new JavaGenerator();
        let sqlG = new SQLGenerator();
        let jmG = new JMGenerator();
        let javaFiles = javaG.generate(data);
        let sqlFiles = sqlG.generate(data);
        let jmgFiles = jmG.generate(data);
        //javaFiles = this.setPackage(name, javaFiles);
        //jmgFiles = this.setPackage(name, jmgFiles);
        let xmlConf = this.createXMLConfigurationFile(name, data);
        //return javaFiles;
        let toReturn = {
            'databaseGenerator.sql': sqlFiles,
            'hibernate.cfg.xml': xmlConf
        };
        let exploded = javaFiles.split('%%SPLIT%%');
        //console.log(exploded);
        for (let i = 0; i < exploded.length; i++) {
            let name = exploded[i].match(/(?<=public class )(.*?)(?= )/g);
            //console.log(name);
            if(name) {
                name = name[0] + '.java';
                toReturn[name] = exploded[i];
            }
        }
        let exploded2 = jmgFiles.split('%%SPLIT%%');
        for (let i = 0; i < exploded2.length; i++) {
            let name =  exploded2[i].match(/(?<=public class )(.*?)(?= )/g);
            if(name) {
                name = name[0] + '.java';
                toReturn[name] = exploded2[i];
            }
        }
        //console.log(toReturn);
        return toReturn;
        //return {'java': javaFiles, 'sql': sqlFiles, 'xml': xmlConf};
    }

    /*setPackage(packageName, javaFiles) {
        javaFiles = javaFiles.replace(new RegExp('%%PACKAGE%%', 'g'), ('package ' + packageName + ';'));
        javaFiles = javaFiles.replace(new RegExp('%%PACKAGEIMP%%', 'g'), ('import ' + packageName + '.'));
        javaFiles = javaFiles.replace(new RegExp('%%PACKAGENOME%%', 'g'), ('package ' + packageName));

        return javaFiles;
    }*/

    createXMLConfigurationFile(name, data) {
        let toReturn = '<?xml version=\'1.0\' encoding=\'utf-8\'?>\n' +
            '<!DOCTYPE hibernate-configuration PUBLIC\n' + '"-//Hibernate/Hibernate Configuration DTD//EN"\n' + '"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">\n' + '<hibernate-configuration>\n' + '<session-factory>\n' +
            '<property name="connection.url">jdbc:mysql://localhost:3306/sennare</property>\n' + '<property name="connection.driver_class">com.mysql.jdbc.Driver</property>\n' + '<property name="connection.username">root</property>\n' +
            '<property name="connection.password">password</property>\n' + '<property name="hibernate.id.new_generator_mappings">false</property>\n';
        if (data.length === 0)
            return '';

        for (let i = 0; i < data.length; i++) {
            let current = data[i];
            toReturn += '<mapping class="' + current.name + '"/>\n';
            let nSubEntities = current.subEntities.length;
            if (nSubEntities > 0) {
                for (let j = 0; j < nSubEntities; j++) {
                    let subEntity = current.subEntities[j].name;
                    toReturn += '<mapping class="' + subEntity + '"/>\n';
                }
            }
        }
        toReturn += '\n</session-factory>\n</hibernate-configuration>';

        return toReturn;
    }

    checkId(data) {

    }

    setNames(data) {
        for (let i = 0; i < data.length; i++) {
            let nSub = data[i].subEntities.length;
            let parentName = data[i].name;
            for (let j = 0; j < nSub; j++) {
                let subEntity = data[i].subEntities[j];
                subEntity.name = parentName + subEntity.name;
            }
        }


    }
}