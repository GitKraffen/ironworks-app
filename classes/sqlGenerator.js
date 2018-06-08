'use strict';
var GeneratorTemplate = require('./generatorTemplate');
module.exports = class SQLGenerator extends GeneratorTemplate {
    constructor(){
        super();
    }
    newEntity(name) {
        this.generatedCode += ('CREATE TABLE ' + name + ' (\n');
    }
    newAttribute(name, type, length, pk, nn, uq, ai, def) {
        if(type == "String")
            type = "varchar";
        if(pk)
            pk = "primary key";
        else
            pk = '';
        if(nn)
            nn = "not null";
        else
            nn = '';
        if(uq)
            uq = "unique";
        else
            uq = '';
        if(ai)
            ai = "auto_increment";
        else
            ai = '';
        if(def)
            def = ' default ' + def;
        if(length!='')
            length = '(' + length + ')';

        this.generatedCode += (name + ' ' + type + length + ' ' + pk + ' ' + nn + ' ' + uq + ' ' + ai + def + ',\n');
    }
    closeEntity() {
        this.generatedCode = this.generatedCode.substring(0, this.generatedCode.length-2);
        this.generatedCode += ('\n);\n');
    }
    newSubEntity(name, parentName) {
        this.generatedCode += ('CREATE TABLE ' + name + ' (\n');
    }
    closeSubEntity(parentName) {
        this.generatedCode = this.generatedCode.substring(0, this.generatedCode.length-2);
        if(this.temporaryClassKey.type == "String")
            this.temporaryClassKey.type = "varchar";
        if(this.temporaryClassKey.length!='')
            this.temporaryClassKey.length = '(' + this.temporaryClassKey.length + ')';
        this.generatedCode += (',\n' + parentName + ' ' + this.temporaryClassKey.type + this.temporaryClassKey.length + ',\n');
        this.generatedCode += 'FOREIGN KEY (' + parentName + ') REFERENCES ' + parentName + '(' + this.temporaryClassKey.name + ')\n' ;
        this.generatedCode += (');\n');
    }

}