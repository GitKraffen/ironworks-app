var app = app || {};
(function() {
    'use strict';

    app.BaseEntity = Backbone.Model.extend({

        defaults: {
            name: 'BaseEntity'//,
            //attr: {}
        },

        initialize: function() {
            //this.set('attr', new app.Attributes());
            if (!this.has('attr'))
                this.set('attr', new app.Attributes());
            /*_.defaults(this, {
                attributes: {
                    attr: new app.Attributes
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
            return this.attr;
        },

        getAttribute: function(attributeName){
            return this.attr.where({name: attributeName});
        },

        setName: function (name) {
            this.set({name: name});
        },

        addAttribute: function (attribute) {
            //this.getAttribute(attr) al posto di clone
            //let attributesTemp = this.attr.clone();
            let attributesTemp = this.get('attr');
            attributesTemp.add(attribute);
            //this.attr = attributesTemp;
        },

        removeAttribute: function (attribute) {
            this.attr.remove(attribute);
        }
    });
})();


/* TESTING ----------------------- */
HotelModel = Backbone.Model.extend({
    initialize: function() {
        // because initialize is called after parse
        _.defaults(this, {
            rooms: new RoomCollection
        });
    },
    parse: function(response) {
        if (_.has(response, "rooms")) {
            this.rooms = new RoomCollection(response.rooms, {
                parse: true
            });
            delete response.rooms;
        }
        return response;
    },
    toJSON: function() {
        var json = _.clone(this.attributes);
        json.rooms = this.rooms.toJSON();
        return json;
    }
});

RoomModel = Backbone.Model.extend({
});

HotelCollection = Backbone.Collection.extend({
    model: HotelModel
});

RoomCollection = Backbone.Collection.extend({
    model: RoomModel
});

var hotels = new HotelCollection();
/*hotels.reset([{
    id: 1,
    name: 'Hotel California',
    rooms: [{
        id: 1,
        name: 'Super Deluxe'
    }]
}], {
    parse: true // tell the collection to parse the data
});

// retrieve a room from a hotel
hotels.get(1).rooms.get(1);

// add a room to the hotel
hotels.get(1).rooms.add({id:2, name:'Another Room'});*/