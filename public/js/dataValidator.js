var app = app || {};

(function () {
    'use strict';

    app.DataValidator = class {
        constructor(data) {
            this.diagram = data;
            this.entities = data.getEntities();
        }

        validate(){
            if(this.validateEntities(this.entities) === false){return false;}
            if(this.validateEntity(this.entities) === false){return false;}
            return true;
        }

        validateEntities(entities) {
            return app.errorFixer.validate('Ent.Col', entities);
        }
        
        validateEntity(entities){
            let correct=true;
            let entity;
            let attributes;
            for (let i = 0; i < entities.length; i++) {
                entity = entities.models[i];
                let name =entity.getName();
                if(app.errorFixer.validate('Ent.ill', entity,entity.getName()) === false){ return false;}
                if(app.errorFixer.validate('Ent.Mod', entity,entity.getName()) === false){correct= false;}
                attributes = entity.getAttributes();
                if(this.validateAttributes(attributes,'Ent.Attr.Col', name) === false){correct = false;}
                if(this.validateAttribute(attributes,'Ent.Attr', name) === false){correct = false;}
                if(this.validateSubentities(entity.getSubEntities(), name) === false){correct = false;}
                if(correct === false){return false;}
            }
            return true;
        }

        validateAttributes(attributes,path, father) {
            return app.errorFixer.validate(path, attributes, father);
        }

        validateAttribute(attributes,path, father) {
            let correct=true;
            for (let j = 0;j< attributes.length; j++) {
                let reference =father + ' > ' + attributes.models[j].getName();
                if(app.errorFixer.validate(path+'.ill', attributes.models[j], reference) === false){return false;}
                if(app.errorFixer.validate(path+'.Mod', attributes.models[j], reference) === false){correct = false;}
            }
            return correct;
        }

        validateSubentities(subentities,father) {
            let subentity;
            let attributes;
            let correct =true;
            if(app.errorFixer.validate('Subent.Col', subentities, father) === false){correct = false;}
                for (let i = 0; i < subentities.length; i++) {
                subentity = subentities.models[i];
                let reference = father + ' > ' +subentity.getName();
                if(app.errorFixer.validate('Subent.ill', subentity,reference) === false){return false;}
                if(app.errorFixer.validate('Subent.Mod', subentity, reference) === false){correct = false;}
                attributes = subentity.getAttributes();
                if(this.validateAttributes(attributes,'Subent.Attr.Col', reference) === false){correct = false;}
                if(this.validateAttribute(attributes,'Subent.Attr', reference) === false){correct = false;}
            }
            return correct;
        }
    }
})();
