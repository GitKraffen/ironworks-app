'use strict';
var GeneratorTemplate = require('./generatorTemplate');
module.exports = class XMLGenerator extends GeneratorTemplate {
    constructor(){
        super();
    }
    newEntity(name) {
        this.generatedCode += '<?xml version = "1.0" encoding = "utf-8"?>\n<!DOCTYPE hibernate-mapping PUBLIC\n"-//Hibernate/Hibernate Mapping DTD//EN"\n"http://www.hibernate.org/dtd/hibernate-mapping-3.0.dtd">\n<hibernate-mapping>\n<class name = "' + name + '" table = "' + name + '">\n';
        this.generatedCode += '<id name = "' + this.temporaryClassKey.name + '" column = "' + this.temporaryClassKey.name + '">\n<generator class="native"/>\n</id>\n'
    }
    newAttribute(name, type, length, pk, nn, uq, ai, def) {
        if(!pk)
            this.generatedCode += '<property name="'+ name + '" type="' + type +'" column="' + name + '" /> \n';
    }
    closeEntity() {
        this.generatedCode += '</class>\n';
    }
    newSubEntity(name, parentName) {
        this.newEntity(name);
    }
    closeSubEntity(parentName) {
        this.generatedCode += '<many-to-one name="' + parentName + '" class="' + parentName + '" column="' + this.temporaryClassKey.name + '" unique="true" not-null="true" cascade="all" />\n</class>\n';
    }
    closeAll() {
        this.generatedCode += '</hibernate-mapping>';
    }

}