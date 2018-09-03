var app = app || {};
(function() {
    'use strict';

    let getBaseData = function(type) {
        return {
            size: { width: 70, height: 70 },
            position: {x: 0, y: 0},
            attrs: {
                image: {
                    width: 70,
                        height: 70,
                        'xlink:href': "image/" + type + ".png"
                },
                text: {
                    'font-size': 14,
                        text: 'base' + type,
                        'text-anchor': 'middle',
                        'ref-x': .5,
                        'ref-dy': 10,
                        'y-alignment': 'middle',
                        fill: '#000000',
                        'font-family': 'Arial, helvetica, sans-serif'
                }
            },
            elementType: type,
            name: 'base' + type,
            inPorts: ['in'],
            outPorts: ['out']
        };
    };

    let baseFuncs = {
        fromJSON: function(json, opt) {

            if (!json.cells) {

                throw new Error('Graph JSON must contain cells array.');
            }

            return this.set(json, opt);
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
            if (this.has('attr'))
                json.attr = this.get('attr').toJSON();
            if (this.has('subEntities'))
                json.subEntities = this.get('subEntities').toJSON();
            return json;
        },

        getName: function() {
            return this.get('name');
        },

        setName: function(name) {
            this.set({name: name});
            this.attr('text/text', name);
        },

        getType () {
            return this.get('elementType');
        },

        setType: function(type) {
            this.set('elementType', type);
        },

        getAttributes: function() {
            if (!this.has('attr'))
                this.set('attr', new app.Attributes());

            return this.get('attr');
        },

        countPK: function() {
            let counted = 0;
            let attributes = this.getAttributes();
            for (let i = 0; i < attributes.length; i++) {
                if (attributes.at(i).getProperty('primaryKey')) {
                    counted ++;
                }
            }
            return counted;
        },

        markup: '<g class="rotatable"><g class="scalable"><image/></g><text/></g>',
    };

    let entityFuncs = {
        getSubEntities: function() {
            if (!this.has('subEntities'))
                this.set('subEntities', new app.Attributes());

            return this.get('subEntities');
        }
    };

    let subEntityFuncs = {
        // Nothing here for the moment
    };

    let constructor = {
        new: function(name, x, y) {
            var element = new this();

            element.set('position', { x: x, y: y });
            element.set('name', name);
            element.attr({
                text: { text: name }
            });

            return element;
        }
    }

    joint.shapes.basic.Image.define('basic.Actor', getBaseData('actor'), baseFuncs, constructor);
    joint.shapes.basic.Image.define('basic.Boundary', getBaseData('boundary'), baseFuncs, constructor);
    joint.shapes.basic.Image.define('basic.Control', getBaseData('control'), baseFuncs, constructor);
    joint.shapes.basic.Image.define('basic.Entity', getBaseData('entity'), {...baseFuncs, ...entityFuncs}, constructor);
    joint.shapes.basic.Image.define('basic.SubEntity', getBaseData('subEntity'), {...baseFuncs, ...subEntityFuncs}, constructor);

    joint.shapes.standard.Rectangle.define('examples.CustomRectangle', {
        attrs: {
            body: {
                rx: 10, // add a corner radius
                ry: 10,
                strokeWidth: 1,
                fill: 'cornflowerblue'
            },
            label: {
                textAnchor: 'left', // align text to left
                refX: 10, // offset text from right edge of model bbox
                fill: 'white',
                fontSize: 18
            }
        }
    }, {
        // inherit joint.shapes.standard.Rectangle.markup
    }, {
        createRandom: function() {

            var rectangle = new this();

            var fill = '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
            var stroke = '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
            var strokeWidth = Math.floor(Math.random() * 6);
            var strokeDasharray = Math.floor(Math.random() * 6) + ' ' + Math.floor(Math.random() * 6);
            var radius = Math.floor(Math.random() * 21);

            rectangle.attr({
                body: {
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDasharray: strokeDasharray,
                    rx: radius,
                    ry: radius
                },
                label: { // ensure visibility on dark backgrounds
                    fill: 'black',
                    stroke: 'white',
                    strokeWidth: 1,
                    fontWeight: 'bold'
                }
            });

            return rectangle;
        }
    });

})();