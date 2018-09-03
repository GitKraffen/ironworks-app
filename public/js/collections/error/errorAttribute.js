var app = app || {};

(function () {
    'use strict';

    app.AttributeError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize: function () {

            let error1 = new app.ErrorModel();
            error1.setName('Nome Attributo nullo, un attributo non può avere nome nullo');
            error1.setDescription('Il nome di un attributo non può essere nullo');
            error1.setSolution(function(attribute) {attribute.setName('attribute')});
            error1.setValidator(function (attribute) {
                return attribute.getName() !== '';
            });

            this.add(error1);

            let error3 = new app.ErrorModel();
            error3.setName('Lunghezza Attributo negativa, non è possibile avere una lunghezza negativa');
            error3.setDescription('Un attributo non può avere lunghezza negativa o pari a 0');
            error3.setSolution(function(attribute) {attribute.setLength(attribute.getLength()*-1)});
            error3.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(type.getLength !== false && attribute.getLength() < 0){
                    return false;
                }
                return true;})

            this.add(error3);

            let error4 = new app.ErrorModel();
            error4.setName('Si è definito un default per questo attributo anche se marcato è Auto Increment');
            error4.setDescription('Un attributo è Auto Increment non può definire un default');
            error4.setSolution(function(attribute) {attribute.setDefault('');attribute.setProperty('defaultCheck',false)});
            error4.setValidator(function (attribute) {
                if(attribute.getProperty('autoIncrement') !== false && attribute.getProperty('defaultCheck') !== false){
                    return false;
                }
                return true;})

            this.add(error4);

            let error7 = new app.ErrorModel();
            error7.setName('Non si ha scelto alcun tipo di dato per questo attributo');
            error7.setDescription('Non è stato definito alcun tipo per questo attributo');
            error7.setSolution(function(attribute) {attribute.setType('varchar');attribute.setLength(64);})
            error7.setValidator(function (attribute) {
                if(attribute.getType() === false){
                        return false;
                }
                return true;})

            this.add(error7);

            let error8 = new app.ErrorModel();
            error8.setName('AI non PK');
            error8.setDescription('Attributo definito come Auto Increment ma non marcato come Primary Key');
            error8.setSolution(function(attribute) {attribute.setProperty('primaryKey',true);})
            error8.setValidator(function (attribute) {
                if(attribute.getProperty('autoIncrement') === true && attribute.getProperty('primaryKey') === false){
                    return false;
                }
                return true;
            })

            this.add(error8);

            let error9 = new app.ErrorModel();
            error9.setName('Definizione errata di NN');
            error9.setDescription('Si è definito questo attributo Not Null assegnandogli però un valore di default null');
            error9.setSolution(function(attribute) {attribute.setProperty('notNull',false);})
            error9.setValidator(function (attribute) {
                if(attribute.getProperty('notNull') === true && attribute.getProperty('defaultCheck') === true){
                    let defaultValue = attribute.getdefault();
                    if(defaultValue === 'NULL' || defaultValue === 'null'){
                        return false;
                    }
                }
                return true;
            })

            this.add(error9);

            let error11 = new app.ErrorModel();
            error11.setName('Si è inserito un valore di default non previsto');
            error11.setDescription('Si è inserito un valore di default senza che sia stata attivata la proprietà default');
            error11.setSolution(function(attribute) {
                attribute.setDefault('');
            })
            error11.setValidator(function (attribute) {
                if(attribute.getProperty('defaultCheck') === false && attribute.getdefault() !== ''){
                    return false;
                }
                return true;
            })

            this.add(error11);

            let error12 = new app.ErrorModel();
            error12.setName('Auto Increment non marcata con tipo int');
            error12.setDescription('Si è marcato questo attributo con AI ma con tipo non intero');
            error12.setSolution(function(attribute) {
                attribute.setType('int');
                attribute.setLength(false);
            })
            error12.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(attribute.getProperty('autoIncrement')){
                    if(type.getCategory() !== 'int'){
                        return false;
                    }
                }
                return true;
            });

            this.add(error12);

            let error13 = new app.ErrorModel();
            error13.setName('Il valore di default inserito ha lunghezza maggiore di quella consentita');
            error13.setDescription('Un attributo non può avere un default che superi la lunghezza massima contentita');
            error13.setSolution(function(attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                attribute.setLength(type.getLength())});
            error13.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(type.getLength() !== false && !type.validate(attribute)){
                    return false;
                }
                return true;})

            this.add(error13);

            let error14 = new app.ErrorModel();
            error14.setName('Lunghezza nulla');
            error14.setDescription('Non si è definita alcuna lunghezza per questo attributo');
            error14.setSolution(function(attribute) {attribute.setLength('64');});
            error14.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                console.log(attribute.getLength());
                if(type.getLength() !== false && attribute.getLength() === ''){
                    return false;
                }
                return true;})

            this.add(error14);
            
        }
    });
})();