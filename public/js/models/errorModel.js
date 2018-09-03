var app = app || {};

(function () {
    'use strict';

    //Attribute Model
    app.ErrorModel = Backbone.Model.extend({
        defaults: {
            name: '',
            description: '',
            type: 'error',
            solution: false,
            validator: false,
        },

        setName: function (name) {
            this.set({name: name});
        },

        getName: function () {
            return this.get('name');
        },

        setDescription: function (error) {
            this.set({description: error});
        },

        getDescription: function () {
            return this.get('description');
        },

        setType(type) {
            if (['error', 'alert', 'log'].indexOf(type) !== -1)
                this.set({type: type})
        },

        getType() {
            return this.get('type');
        },

        setSolution: function (func) {
            this.set({solution: func});
        },

        hasSolution: function () {
            return (typeof this.get('solution') === 'function');
        },

        fixProblem: function (subject) {
            let func = this.get('solution');
            return func(subject);
        },

        setValidator: function (func) {
            this.set({validator: func});
        },

        validate: function (subject) {
            let func = this.get('validator');
            return func(subject);
        }
    })
}());