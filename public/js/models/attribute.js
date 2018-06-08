var app = app || {};

(function () {
    'use strict';

    //Attribute Model
    app.Attribute = Backbone.Model.extend({
        defaults: {
            name:'',
            type:'',
            length: 10, //TODO: Lunghezza a seconda del campo
            primaryKey:false,
            uniqueKey:false,
            notNull:false,
            autoIncrement:false,
            defaultCheck:false,
            defaultText: ''
        },

        setName: function (name) {
            this.set({name: name});
        },

        setLength: function(length){
            this.set({length: length});
        },

        setType: function (type) {
            this.set({type: type});
        },

        setDefault: function (def) {
            this.set({defaultText: def});
        },

        setProperty: function (property, value) {
            switch(property.toString().toUpperCase()){
                case ('primaryKey').toUpperCase():
                    this.set({primaryKey:value});
                    break;
                case ('uniqueKey').toUpperCase():
                    this.set({uniqueKey:value});
                    break;
                case ('notNull').toUpperCase():
                    this.set({notNull:value});
                    break;
                case ('autoIncrement').toUpperCase():
                    this.set({autoIncrement:value});
                    break;
                case ('defaultCheck').toUpperCase():
                    this.set({defaultCheck:value});
                    break;

            }
        },

        getName: function () {
            return this.get('name');
        },

        getLength: function () {
            return this.get('length');
        },

        getType: function () {
            return this.get('type');
        },

        getdefault: function () {
            return this.get('defaultText');
        },

        getProperty: function (property) {
            let result = '';
            switch(property.toString().toUpperCase()){
                case 'primaryKey'.toUpperCase():
                    result = this.get('primaryKey');
                    break;
                case 'uniqueKey'.toUpperCase():
                    result = this.get('uniqueKey');
                    break;
                case 'notNull'.toUpperCase():
                    result = this.get('notNull');
                    break;
                case 'autoIncrement'.toUpperCase():
                    result = this.get('autoIncrement');
                    break;
                case 'defaultCheck'.toUpperCase():
                    result = this.get('defaultCheck');
                    break;

            }
            return result;
        }
    });
})();
