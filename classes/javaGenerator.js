'use strict';
var GeneratorTemplate = require('./generatorTemplate');
module.exports = class JavaGenerator extends GeneratorTemplate {
    constructor(){
        super();
    }
    newEntity(name) {
        this.generatedCode += ('public class ' + name + ' {\n');
    }
    newAttribute(name, type, length, pk, nn, uq, ai, def) {
        this.generatedCode += ('public ' + type + ' ' + name + ';\n');
        this.temporaryClassMethod += (type + ' get' + name.substring(0,1).toUpperCase() + name.substring(1) + '() {return ' + name + ';}\n');
        this.temporaryClassMethod += ('void set' + name.substring(0,1).toUpperCase() + name.substring(1) + '(' + type + ' ' + name + ') {this.' + name + ' = ' + name + ';}\n');
    }
    closeEntity() {
        this.generatedCode += ('%%SUBCLASSES%%\n');
        this.generatedCode += (this.temporaryClassMethod);
        this.generatedCode += ('}\n');
        this.temporaryClassMethod = '';
    }
    newSubEntity(name, parentName) {
        this.temporaryClassExtra += ('public class ' + name + ';\n')
        this.generatedCode += ('class ' + name + ' {\n');
    }
    closeSubEntity(parentName) {
        this.generatedCode += (this.temporaryClassMethod);
        this.generatedCode += ('}\n');
        this.temporaryClassMethod = '';
    }
    closeAll() {
        this.generatedCode = this.generatedCode.replace(new RegExp('%%SUBCLASSES%%', 'g'), this.temporaryClassExtra);
        this.reset();
    }
}
