var app = app || {};

(function () {
    'use strict';

    app.SubentityAttributesError = Backbone.Collection.extend({
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
                    if (names.indexOf(attribute.getName()) !== -1) {
                        let num=0;
                        let attributeName=attribute.getName();
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
                    }
                    names.push(attribute.getName());
                }
            })
            error1.setValidator(function (attributes) {
                let attribute;
                let names= [];
                let counter=0;

                for(let i=0; i<attributes.length; i++) {
                    attribute = attributes.models[i];
                    if (names.indexOf(attribute.getName()) !== -1) {
                        counter++;
                    }
                    names.push(attribute.getName());
                }
                return counter === 0;

            })

            this.add(error1);

            let error2 = new app.ErrorModel();
            error2.setName('Sono presenti più Auto Increment, ve ne si può inserie soltanto uno per Subentity');
            error2.setDescription('Sono presenti più di un Autoincrement nella entity corrente');
            error2.setSolution(function (attributes) {
                let attribute;
                let counter=0;
                for (var i = 0; i < attributes.length; i++) {
                    attribute = attributes.models[i];
                    let isAI = attribute.getProperty('autoIncrement');
                    if (isAI === true) {
                        counter++;
                        if (counter > 1) {
                            attributes.remove(attribute);
                        }
                    }
                }
            });
            error2.setValidator(function (attributes) {
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

            this.add(error2);

            let error3 = new app.ErrorModel();
            error3.setName('Non è presente alcun attributo in questa Subentity');
            error3.setDescription('Non è presente alcun attributo');
            error3.setSolution(function(attributes) {
                let attribute =new app.Attribute();
                attribute.setName('Id');
                attributes.add(attribute);
            });
            error3.setValidator(function (attributes) {
                return attributes.length !== 0; });

            this.add(error3);        }
    });
})();