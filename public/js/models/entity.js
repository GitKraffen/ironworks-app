var app = app || {};

(function() {
    'use strict';

    app.Entity = app.BaseEntity.extend({

        initialize: function() {
            if (!this.has('attr'))
                this.set('attr', new app.Attributes());
            if (!this.has('subEntities'))
                this.set('subEntities', new app.SubEntities());
        },
        parse: function(response) {
            if (_.has(response, "attr")) {
                let temp = new app.Attributes(response.attr);
                this.set('attr', temp);
                delete response.attr;
            }
            if (_.has(response, "subEntities")) {
                let temp = new app.SubEntities(response.subEntities, {
                    parse: true
                });
                this.set('subEntities', temp);
                delete response.subEntities;
            }
            return response;
        },
        toJSON: function() {
            var json = _.clone(this.attributes);
            json.attr = this.get('attr').toJSON();
            json.subEntities = this.get('subEntities').toJSON();
            return json;
        },

        getSubEntity: function (entityName) {
            let tempSubEntities = this.get('subEntities');
            return tempSubEntities.where({name: entityName});
        },

        newSubEntity: function () {
            let tempSubEntities = this.get('subEntities');
            tempSubEntities.add(new app.SubEntity());
        },

        removeSubEntity: function (subEntityName) {
            let tempSubEntities =this.get('subEntities');
            tempSubEntities.remove(subEntityName);
        },

        getSubEntities: function () {
            return this.get('subEntities');
        }
    });
})();