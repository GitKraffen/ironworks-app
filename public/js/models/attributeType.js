var app = app || {};

(function () {
    'use strict';

    //Attribute Model
    app.AttributeType = Backbone.Model.extend({
        defaults: {
            name: '',
            category: '',
            max: false,
            min: false,
            length: false,
            regex: false,
            validator: false,
        },

        setName: function (name) {
            this.set({name: name});
        },

        getName: function () {
            return this.get('name');
        },

        setCategory: function (category) {
            this.set({category: category});
        },

        getCategory: function () {
          return this.get('category');
        },

        setMax: function (max) {
          this.set({max: max});
        },
        getMax: function () {
            return this.get('max');
        },

        setMin: function (min) {
            this.set({min : min});
          },

        getMin: function () {
            return this.get('min');
        },

        setLength: function (length) {
            this.set({length: length});
        },

        getLength: function () {
            return this.get('length');
        },

        setRegex: function (regex) {
            this.set({regex: regex});
        },

        getRegex: function () {
            return this.get('regex');
        },

        setValidator: function (func) {
          this.validator = func;
        },

        validate: function (subject) {
          return this.validator(subject);
      }

    })
}());