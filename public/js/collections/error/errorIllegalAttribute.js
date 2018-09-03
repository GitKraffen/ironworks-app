var app = app || {};

(function () {
    'use strict';

    app.IllegalAttributeError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize: function () {

            let error0 = new app.ErrorModel();
            error0.setName('Nome attributo illegale, può essere formato solo da lettere o numeri');
            error0.setDescription('Il nome di un attributo non può essere illegale');
            error0.setSolution(function(attribute) {
                attribute.setName(helper.setLegal(attribute.getName()));
            });
            error0.setValidator(function (attribute) {
                return helper.isLegal(attribute.getName());
            });
            this.add(error0);
  
            let error3 = new app.ErrorModel();
            error3.setName('Default illegale, deve corrispondere ad una di queste forme: AAAA-MM-GG, now(), NOW()');
            error3.setDescription('Valore di default date non in forma AAAA-MM-GG, now(), NOW()');
            error3.setSolution(function(attribute) {
                attribute.setProperty('defaultCheck',false);
                attribute.setDefault('');
            });
            error3.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(attribute.getProperty('defaultCheck') === true && type.getCategory() === 'date' && !type.validate(attribute)){
                    return false;
                }
                return true;
            });

            this.add(error3);

            let error4 = new app.ErrorModel();
            error4.setName('Default illegale tipo int, deve essere un intero');
            error4.setDescription('Definito un tipo di default date illegale');
            error4.setSolution(function(attribute) {
                attribute.setProperty('defaultCheck',false);
                attribute.setDefault('');
            });
            error4.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(attribute.getProperty('defaultCheck') === true && type.getCategory() === 'int' && !type.validate(attribute)){
                    return false;
                }
                return true;
            });

            this.add(error4);

            let error5 = new app.ErrorModel();
            error5.setName('Default illegale tipo text, può essere formato solo da lettere e numeri');
            error5.setDescription('Definito un tipo di default date illegale');
            error5.setSolution(function(attribute) {
                attribute.setProperty('defaultCheck',false);
                attribute.setDefault('');
            });
            error5.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(attribute.getProperty('defaultCheck') === true && type.getCategory() === 'text' && !type.validate(attribute)){
                    return false;
                }
                return true;
            });

            this.add(error5);

            let error13 = new app.ErrorModel();
            error13.setName('Lunghezza illegale, non è possibile definire una lunghezza negativa');
            error13.setDescription('Un attributo non può avere lunghezza illegale');
            error13.setSolution(function(attribute) {
            attribute.setLength(helper.setLegal(attribute.getLength()))});
            error13.setValidator(function (attribute) {
                let type= app.type.findWhere({name: attribute.getType()});
                if(type.getLength() !== false && !helper.isInt(attribute.getLength()) && attribute.getLength() !== ''){
                    return false;
                }
                return true;})

            this.add(error13);

            
        }
    });
})();