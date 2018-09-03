'use strict';
var GeneratorTemplate = require('./generatorTemplate');

// Loading field types
var execfile = require("./execfile");
let jsVanillaImported = execfile("./public/js/fieldTypes.js");
let app = jsVanillaImported.app;

module.exports = class JavaGenerator extends GeneratorTemplate {
    constructor(){
        super();
    }
    newEntity(name) {
        //this.generatedCode += '%%PACKAGENOME%%;\n\n';
        this.generatedCode += 'import javax.persistence.*;\n' + 'import java.util.Objects;\n';
        this.generatedCode += 'import java.io.Serializable;\n';
        this.generatedCode += '\n@Entity \n@Table(name = "' + name + '", schema = "database")\n\n';
        this.generatedCode += 'public class ' + name;
        this.generatedCode += ' implements Serializable';
        this.generatedCode+= ' {\n';
    }
    newAttribute(name, type, length, pk, nn, uq, ai, defCheck, def) {
        /*if(type.includes('int'))
            type = 'int';
        else if(type.includes('date'))
            type = 'String';
        else if(type == 'string')
            type = 'String';*/

        type = app.fieldTypes[type].javaName;

        if(pk) {
            if(ai) {
                this.generatedCode += '@Id @GeneratedValue\n' + '@Column(name = "' + this.temporaryClassKey[0].name + '")\n';
            }
            else
                this.generatedCode += '@Id \n' + '@Column(name = "' + this.temporaryClassKey[0].name + '")\n';

            this.generatedCode += ('private ' + type + ' ' + this.temporaryClassKey[0].name + ';\n');
            this.temporaryClassMethod += ('public ' + type + ' get' + this.temporaryClassKey[0].name.substring(0, 1).toUpperCase() + this.temporaryClassKey[0].name.substring(1) + '() {return ' + this.temporaryClassKey[0].name + ';}\n');
            this.temporaryClassMethod += ('public void set' + this.temporaryClassKey[0].name.substring(0, 1).toUpperCase() + this.temporaryClassKey[0].name.substring(1) + '(' + type + ' ' + this.temporaryClassKey[0].name + ') {this.' + this.temporaryClassKey[0].name + ' = ' + this.temporaryClassKey[0].name + ';}\n');
            this.temporaryClassKey.push(this.temporaryClassKey[0]);
            this.temporaryClassKey.shift();
        }
        else {
            this.generatedCode += '@Column(name = "' + name + '")\n';
            this.generatedCode += ('private ' + type + ' ' + name + ';\n');
            this.temporaryClassMethod += ('public ' + type + ' get' + name.substring(0,1).toUpperCase() + name.substring(1) + '() {return ' + name + ';}\n');
            this.temporaryClassMethod += ('public void set' + name.substring(0,1).toUpperCase() + name.substring(1) + '(' + type + ' ' + name + ') {this.' + name + ' = ' + name + ';}\n');
        }

    }
    closeEntity() {
        this.generatedCode += (this.temporaryClassMethod);

        this.generatedCode += ('}\n');
        this.temporaryClassMethod = '';
        this.generatedCode += '%%SPLIT%%';
    }
    newSubEntity(name, parentName) {
        /*this.temporaryClassExtra += ('public class ' + name + ';\n')
        this.generatedCode += ('class ' + name + ' {\n');*/
        this.temporaryClassKey = this.temporarySubEntity;
        this.newEntity(name);

    }
    closeSubEntity(parentName) {
        this.generatedCode += '@Id\n@ManyToOne(fetch = FetchType.LAZY)\n';
        for(let i = 0; i < this.temporaryMultipleFK.length; i++) {
            this.generatedCode+='@JoinColumn(name="' + parentName + '_' + this.temporaryMultipleFK[i].name + '")\n';
        }
        this.generatedCode+= '\n' + 'private ' + parentName + ' ' + parentName.toLowerCase() + ';\n';
        this.generatedCode += ('public ' + parentName + ' get' + parentName.substring(0,1).toUpperCase() + parentName.substring(1) + '() {return ' + parentName.toLowerCase() + ';}\n');
        this.generatedCode += 'public void set' + parentName.substring(0,1).toUpperCase() + parentName.substring(1) + '(' + parentName + ' ' + parentName.toLowerCase() + ') {this.' + parentName.toLowerCase() + ' = ' + parentName.toLowerCase() + ';}\n'
        this.generatedCode += (this.temporaryClassMethod);
        this.generatedCode += ('}\n');
        this.temporaryClassMethod = '';
        this.generatedCode += '%%SPLIT%%';
    }
    closeAll() {
        //this.generatedCode = this.generatedCode.replace(new RegExp('%%SUBCLASSES%%', 'g'), this.temporaryClassExtra);
        this.reset();
    }
}
