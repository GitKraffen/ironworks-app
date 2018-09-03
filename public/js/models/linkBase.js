var app = app || {};
(function() {
    'use strict';

    let basicFuncs = {
        getType: function() {
            return this.get('type');
        },

        getLabelText: function(index = 0) {
            return this.prop(['labels', index, 'attrs','text','text']);
        },

        setLabelText: function(val, index = 0) {
            console.log('cambio in '+val);
            return this.prop(['labels', index, 'attrs','text','text'], val);
        },

        highlightLink() {
            this.prop(['labels', 0, 'attrs', 'text', 'font-size'], '18');
            this.attr('.marker-target/fill', '#feb663');
            this.attr('.marker-target/stroke', '#feb663');
            this.attr('.connection/stroke', '#feb663');
            this.attr('.connection/strokeWidth', 2);
        },

        unHighlightLink() {
            this.prop(['labels', 0, 'attrs', 'text', 'font-size'], '14');
            this.attr('.marker-target/fill', 'black');
            this.attr('.marker-target/stroke', 'black');
            this.attr('.connection/stroke', 'black');
            this.attr('.connection/strokeWidth', 1);
        }
    };

    joint.dia.Link.define('standard.BasicLink', {
        attrs: {
            '.connection': {
                stroke: 'black'
            },
            '.marker-target': { fill: '#4b4a67', stroke: '#4b4a67', d: 'M 10 0 L 0 5 L 10 10 z' }
        },
        labels: [
            {
                attrs: { text: { text: '' } },
                position: 0.5
            }
        ]
    }, basicFuncs);

    joint.shapes.standard.Link.define('standard.RelationLink', {
        attrs: {
            line: {
                strokeWidth: 1,
                strokeLinejoin: 'round'
            },
        },
        labels: [
            {
                attrs: { text: { text: '1' } },
                position: 0.1
            },
            {
                attrs: { text: { text: '1' } },
                position: 0.8
            }
        ],
        markup: [
            '<path class="connection" stroke="black" d="M 0 0 0 0"/>'
        ].join(''),
    }, {...basicFuncs, ...{
        setRelation1N: function() {
            this.prop(['labels',0, 'attrs','text','text'], 'N');
        },
        setRelation11: function() {
            this.prop(['labels',0, 'attrs','text','text'], '1');
        }
    }});

})();