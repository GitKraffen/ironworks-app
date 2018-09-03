var app = app || {};

(function () {
    'use strict';

    app.EntityAttributesError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize :function () {

            let error1 = new app.ErrorModel();
            error1.setName('Nome attributo multiplo, sono presenti più attributi con lo stesso nome');
            error1.setDescription('Attributo con lo stesso nome già esistente');
            error1.setSolution(function(attributes) {
                let attribute;
                let names= [];
                for(let i=0; i<attributes.length; i++) {
                    attribute = attributes.models[i];
                    if (names.indexOf(attribute.getName().toLowerCase()) !== -1) {
                        let num=0;
                        let attributeName=attribute.getName().toLowerCase();
                        let sent=true;
                        let newName;
                        while(sent === true){
                            newName = attributeName + num;
                            if (names.indexOf(newName.toLowerCase()) === -1) {
                                attribute.setName(newName.toLowerCase());
                                sent=false;
                            }
                            else{
                                num++;
                            }
                        }
                    }
                    names.push(attribute.getName().toLowerCase());
                }
            })
            error1.setValidator(function (attributes) {
                let attribute;
                let names= [];
                let counter=0;

                for(let i=0; i<attributes.length; i++) {
                    attribute = attributes.models[i];
                    if (names.indexOf(attribute.getName().toLowerCase()) !== -1) {
                        counter++;
                    }
                    names.push(attribute.getName().toLowerCase());
                }
                return counter === 0;

            })

            this.add(error1);

            let error2 = new app.ErrorModel();
            error2.setName('Primary key mancante, non è stata definita alcuna Primary Key per questa Entity');
            error2.setDescription('Data una collection di attributi non è presente una Primary key');
            error2.setSolution(function (attributes) {
                let names= [];
                let attribute;

                for(let i=0; i<attributes.length; i++) {
                    attribute = attributes.models[i];
                    names.push(attribute.getName());
                }

                attribute=new app.Attribute();
                attribute.setType('int');
                attribute.setProperty('autoIncrement',true);
                attribute.setProperty('primaryKey',true);
                attribute.setLength(false);

                let num=0;
                let attributeName='Id';
                let sent=true;
                let newName;
                while(sent === true){
                    newName = attributeName + num;
                    if (names.indexOf(newName) === -1) {
                        attribute.setName(newName);
                        sent=false;
                    }
                    else{
                        num++;
                    }
                }
                attributes.push(attribute);
            })
            error2.setValidator(function (attributes) {
                let attribute;

                for (var i = 0; i < attributes.length; i++) {
                    attribute = attributes.models[i];
                    if (attribute.getProperty('primaryKey') === true) {
                        return true;
                    }
                }
                return false;
            })

            this.add(error2);

            let error3 = new app.ErrorModel();
            error3.setName('Sono presenti più Auto Increment, ve ne si può inserie soltanto uno per Entity');
            error3.setDescription('Sono presenti più di un Autoincrement nella entity corrente');
            error3.setSolution(function (attributes) {
                let attribute;
                let pk=0;
                for (var i = 0; i < attributes.length; i++) {
                    attribute = attributes.models[i];
                    if(attribute.getProperty('autoIncrement') === true){
                        if(attribute.getProperty('primaryKey') === true){
                            pk++;
                            if(pk>1){
                                attributes.remove(attribute);
                                i=-1;
                                pk=0;
                            }
                        }
                        else{
                            attributes.remove(attribute);
                            i=-1;
                        }
                    }
                }
            });
            error3.setValidator(function (attributes) {
                let attribute;
                let counter = 0;

                for (var i = 0; i < attributes.length; i++) {
                    attribute = attributes.models[i];
                    if (attribute.getProperty('autoIncrement') === true) {
                        counter++;
                        if (counter > 1) {
                            return false;
                        }
                    }
                }
                return true;
            })

            this.add(error3);

            let error4 = new app.ErrorModel();
            error4.setName('Non è presente alcun attributo in questa Entity');
            error4.setDescription('Non è presente alcun attributo');
            error4.setSolution(function(attributes) {
                let attribute =new app.Attribute();
                attribute.setName('Id');
                attribute.setType('int');
                attribute.setProperty('primaryKey',true);
                attribute.setProperty('autoIncrement',true);
                attributes.add(attribute);
            });
            error4.setValidator(function (attributes) {
                return attributes.length !== 0; });

            this.add(error4);
        }
    });
})();