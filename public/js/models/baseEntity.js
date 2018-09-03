var app = app || {};
(function() {
    'use strict';

    app.BaseEntity = Backbone.Model.extend({

        defaults: {
            name: 'BaseEntity'//,
            //attr: {}
        },

        initialize: function() {
            if (!this.has('attr')){
                this.set('attr', new app.Attributes());
            }
        },
        parse: function(response) {
            if (_.has(response, "attr")) {
                let temp = new app.Attributes(response.attr);
                this.set('attr', temp);
                delete response.attr;
            }
            return response;
        },
        toJSON: function() {
            var json = _.clone(this.attributes);
            json.attr = this.get('attr').toJSON();
            return json;
        },

        sync: function () { return false; },

        getName: function () {
            return this.get('name');
        },

        getAttributes: function () {
            return this.get('attr');
        },

        getAttribute: function(attributeName){
            return this.get('attr').where({name: attributeName});
        },

        setName: function (name) {
            this.set({name: name});
        },

        addAttribute: function (attribute) {
            let attributesTemp = this.get('attr');
            attributesTemp.add(attribute);
        },

        removeAttribute: function (attribute) {
            let attributesTemp = this.get('attr');
            attributesTemp.remove(attribute);
        }
    });
})();