'use strict';
module.exports = class GeneratorTemplate {
    constructor() {
        this.generatedCode = '';
        this.temporaryClassMethod = '';
        this.temporaryClassExtra = '';
        this.temporaryClassKey = [];
        this.temporarySubEntity='';
        this.temporaryMultipleFK=[];
    }

    generate(data) {
        if (data.length === 0)
            return '';
        for (let i = 0; i < data.length; i++) {
            this.temporaryClassExtra = 0;
            let current = data[i];
            let parentName = current.name;
            this.temporaryClassKey = this.findPrimaryKey(current);
            this.temporaryMultipleFK = this.temporaryClassKey;
            this.newEntity(current.name);
            if (current.attr.length > 0) {
                for (let j = 0; j < current.attr.length; j++) {
                //for(let key in current.attr) {
                    let attribute = current.attr[j];
                    this.newAttribute(
                        attribute.name,
                        attribute.type,
                        attribute.length,
                        attribute.primaryKey,
                        attribute.notNull,
                        attribute.uniqueKey,
                        attribute.autoIncrement,
                        attribute.defaultText
                    );
                }
            }
            this.closeEntity();
            let nSubEntities = current.subEntities.length;
            if (nSubEntities > 0) {
                this.temporaryClassExtra = 1;
                for (let j = 0; j < nSubEntities; j++) {
                    let subEntity = current.subEntities[j];
                    this.temporarySubEntity = this.findPrimaryKey(subEntity);
                    this.newSubEntity(
                        subEntity.name,
                        parentName
                    );
                    for (let k = 0; k < subEntity.attr.length; k++) {
                        let attribute = subEntity.attr[k];
                        this.newAttribute(
                            attribute.name,
                            attribute.type,
                            attribute.length,
                            attribute.primaryKey,
                            attribute.notNull,
                            attribute.uniqueKey,
                            attribute.autoIncrement,
                            attribute.defaultCheck,
                            attribute.defaultText
                        );
                    }
                    this.closeSubEntity(parentName);
                }
            }
            //this.closeSubEntity(parentName);
        }

        this.closeAll();
        return this.generatedCode;
    }

    newEntity(name) {

    }

    newAttribute(name, type, length, pk, nn, uq, ai, defCheck, def) {

    }

    newSubEntity(name, parentName) {

    }

    closeEntity() {

    }
    closeSubEntity(parentName) {

    }
    closeAll() {

    }
    findPrimaryKey(data) {
        let v = [];
        if(data.attr.length === 0)
            return '';
        for (let i = 0; i < data.attr.length; i++) {
            let attribute = data.attr[i];
            if(attribute.primaryKey === true) {
                v.push(attribute);
            }
        }
        return v;
        //return null;
    }
    reset(){
        this.temporaryClassMethod = '';
        //this.temporaryClassExtra = '';
    }


}
