'use strict';
var GeneratorTemplate = require('./generatorTemplate');

// Loading field types
var execfile = require("./execfile");
let jsVanillaImported = execfile("./public/js/fieldTypes.js");
let app = jsVanillaImported.app;

module.exports = class SQLGenerator extends GeneratorTemplate {
    constructor(){
        super();
    }
    newEntity(name) {
        this.generatedCode += ('CREATE TABLE ' + name + ' (\n');
    }
    newAttribute(name, type, length, pk, nn, uq, ai, defCheck, def) {
        let sqlRow = [];
        sqlRow.push(name);
        sqlRow.push(type);
        if(app.fieldTypes[type].maxLength !== undefined) {
            sqlRow.push('(' + length + ')');
            def = '\'' + def + '\'';
        }
        if(pk && this.temporaryClassExtra===0 && this.temporaryClassKey.length===1)
            sqlRow.push('primary key');
        if(nn)
            sqlRow.push('not null');
        if(uq)
            sqlRow.push('unique');
        if(ai)
            sqlRow.push('auto_increment');
        if(defCheck)
            sqlRow.push('default ' + def);
        sqlRow.push(',\n');
        this.generatedCode += sqlRow.join(' ');

        /*if(this.temporarySubEntity != '')
            this.generatedCode += (name + ' ' + type + length  + ' ' + nn + ' ' + uq + ' ' + ai + def + ',\n');
        else
            this.generatedCode += (name + ' ' + type + length + ' ' + pk + ' ' + nn + ' ' + uq + ' ' + ai + def + ',\n');*/
    }
    closeEntity() {
        this.generatedCode = this.generatedCode.substring(0, this.generatedCode.length-2);
        if(this.temporaryClassKey.length>1) {
            let primKey = this.temporaryClassKey.map(e => e.name).join(",");
            this.generatedCode += ',\nPRIMARY KEY (' + primKey + ')';
        }
        this.generatedCode += ('\n);\n');
    }
    newSubEntity(name, parentName) {
        this.generatedCode += ('CREATE TABLE ' + name + ' (\n');
    }
    closeSubEntity(parentName) {
        this.generatedCode = this.generatedCode.substring(0, this.generatedCode.length - 2);
        //
        let attLength = '';
        let foreignTotal = '';
        let fatherTotal = '';
        if (this.temporaryClassKey.length > 1) {
            this.generatedCode += ',\n';
            for (let i = 0; i < this.temporaryClassKey.length; i++) {
                //let foreign = this.temporaryClassKey.map(e => e.name).join(",");
                //let foreign = '';
                if(app.fieldTypes[this.temporaryClassKey[i].type].maxLength !== undefined)
                    attLength = ' (' + this.temporaryClassKey[i].length + ')';
                this.generatedCode += parentName + '_' + this.temporaryClassKey[i].name + ' ' + this.temporaryClassKey[i].type + attLength + ' not null,\n';
                //foreign += parentName + '_' + this.temporaryClassKey[i].name + ', ';
                foreignTotal += parentName + '_' + this.temporaryClassKey[i].name + ', ';
                fatherTotal += this.temporaryClassKey[i].name + ', ';
                if (this.temporarySubEntity.length === 0 && i===this.temporaryClassKey.length-1) {
                    //this.generatedCode += (',\n' + parentName.toLowerCase() + ' ' + this.temporaryClassKey[i].type + attLength + ' PRIMARY KEY' + ',\n');
                    this.generatedCode += 'PRIMARY KEY (' + foreignTotal.substring(0,foreignTotal.length-2) + '),\n';
                    this.generatedCode += 'FOREIGN KEY (' + foreignTotal.substring(0,foreignTotal.length-2) + ') REFERENCES ' + parentName + '(' + fatherTotal.substring(0,fatherTotal.length-2) + ')\n';
                    this.generatedCode += (');\n');
                }
                else if(i===this.temporaryClassKey.length-1) {
                    let primKey = this.temporarySubEntity.map(e => e.name).join(",");
                    //this.generatedCode += (',\n' + parentName.toLowerCase() + ' ' + this.temporaryClassKey[i].type + attLength + ' not null,\n');
                    this.generatedCode += 'PRIMARY KEY (' + primKey + ', ' + foreignTotal.substring(0,foreignTotal.length-2) + '),\n';
                    this.generatedCode += 'FOREIGN KEY (' + foreignTotal.substring(0,foreignTotal.length-2) + ') REFERENCES ' + parentName + '(' + fatherTotal.substring(0,fatherTotal.length-2) + ')\n';
                    this.generatedCode += (');\n');
                }

            }
        }
        else {
            if(app.fieldTypes[this.temporaryClassKey[0].type].maxLength !== undefined)
                attLength = ' (' + this.temporaryClassKey[0].length + ')';
            if (this.temporarySubEntity.length === 0) {
                this.generatedCode += (',\n' + parentName + '_' + this.temporaryClassKey[0].name + ' ' + this.temporaryClassKey[0].type + attLength + ' PRIMARY KEY' + ',\n');
            }
            else {
                let primKey = this.temporarySubEntity.map(e => e.name).join(",");
                this.generatedCode += (',\n' + parentName + '_' + this.temporaryClassKey[0].name + ' ' + this.temporaryClassKey[0].type + attLength + ' not null,\n');
                this.generatedCode += 'PRIMARY KEY (' + primKey + ',' + parentName + '_' + this.temporaryClassKey[0].name + '),\n';
            }
            this.generatedCode += 'FOREIGN KEY (' + parentName + '_' + this.temporaryClassKey[0].name + ') REFERENCES ' + parentName + '(' + this.temporaryClassKey[0].name + ')\n';
            this.generatedCode += (');\n');
        }
    }

}