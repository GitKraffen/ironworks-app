var app = app || {};

(function() {
    'use strict';

    app.Entity = app.BaseEntity.extend({

        /*defaults: _.extend({},app.BaseEntity.prototype.defaults,
            {
                subEntities: {}
            }
        ),*/

        initialize: function() {
            //this.set('attr', new app.Attributes());
            //this.set('subEntities', new app.SubEntities());
            if (!this.has('attr'))
                this.set('attr', new app.Attributes());
            if (!this.has('subEntities'))
                this.set('subEntities', new app.SubEntities());
            /*_.defaults(this, {
                attributes: {
                    attr: new app.Attributes,
                    subEntities: new app.SubEntities
                }
            });*/
        },
        parse: function(response) {
            debugger;
            if (_.has(response, "attr")) {
                let temp = new app.Attributes(response.attr);
                this.set('attr', temp);
                /*this.attr = new app.Attributes(response.attr, {
                    parse: true
                });*/
                delete response.attr;
            }
            if (_.has(response, "subEntities")) {
                let temp = new app.SubEntities(response.subEntities, {
                    parse: true
                });
                this.set('subEntities', temp);
                /*this.subEntities = new app.Attributes(response.subEntities, {
                    parse: true
                });*/
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
            //return this.subEntities.where({name: entityName});
            let tempSubEntities = this.get('subEntities');
            return tempSubEntities.where({name: entityName});
        },

        newSubEntity: function () {
            /*let count = 0;
            this.subEntities.pluck('name');
            this.subEntities.each(function (nome) {
                if (nome.getName() === "Entity".concat(count.toString()))
                    count++;
            });
            let subEntityTemp = new app.SubEntity({name: 'Entity'.concat(count.toString())});
            this.subEntities.add(subEntityTemp);*/
            let tempSubEntities = this.get('subEntities');
            tempSubEntities.add(new app.SubEntity());
        },

        removeSubEntity: function (subEntityName) {
            this.subEntities.remove(subEntityName);
        },

        getSubEntities: function () {
            return this.subEntities;
        }
    });
})();