var app = app || {};

(function ($) {
    'use strict';

    app.RobustnessDiagramView = Backbone.View.extend({
        tagName: 'div',
        graph: false,
        paper: false,
        resources: {},
        queueElements: {},
        processing: 0,

        initialize: function(disabled = false) {
            this.initializeEditor(disabled)
            //this.$el.html(this.template);
        },

        render: function() {
            return this.$el;
        },

        getGraph: function() {
            return this.graph;
        },

        fromJSON: function(json) {
            this.graph.fromJSON(json);
        },

        setPaperDimensions: function(x, y) {
            this.paper.setDimensions(x, y);
        },

        eventSelectElement: function(cellView, evt, x, y) {
            this.trigger('selectElement', cellView);
        },

        eventDoubleClick: function(cellView, evt, x, y) {
            this.trigger('enterZoom', cellView);
        },

        newElement: function(type, name, x = 0, y = 0) {
            // If resource is not jet loaded we put this element in element's queue
            if (!(type in this.resources)){
                console.log(type + " not yet loaded...");
                this.queueElements.push({
                    'elem': type,
                    'x': x,
                    'y': y,
                    'name': name});
                return false;
            }

            // TODO: generate ID ??
            // TODO: check if ID already inside graph
            // TODO: Name of the element --- if entity it must be unique!!

            // Clone base resource but change position with requested.
            let newElement = this.resources[type].clone().position(0, 0);
            newElement.attributes.attrs.text.text = name;
            newElement.attributes.position.x = x;
            newElement.attributes.position.y = y;
            // Add new element in graph
            this.graph.addCells( newElement );
            return newElement;
        },

        newLink: function(element1, element2) {
            // If same element just say it to user and ignore this link

            if(helper.areLinkable(element1, element2)) {

                if (element1.model.id === element2.model.id) {
                    // Error same element
                    console.log('Errore nel collegamento');
                } else {
                    // Creating link between two selected elements
                    let link = new joint.shapes.devs.Link({
                        source: {
                            id: element1.model.id,
                            port: 'out'
                        },
                        target: {
                            id: element2.model.id,
                            port: 'in'
                        },
                        connector: {name: 'rounded'}
                    });

                    // Adding link to graph
                    this.graph.addCell(link);
                    return true;
                }
            }
            return false;
        },

        removeElement: function(name) {
            // remove? i think this can be made by appView!
        },

        loadResources: function() {       // Increase process counter, until this resource is loaded we won't start editor
            this.processing = 4;
            // Load svg resource, when is loaded call setResource(...)
            $.get('./image/boundary.svg', function(ret){
                // Decrease process counting, this res is loaded
                this.processing--;
                this.setResource("boundary", ret)
            }.bind(this), 'text');

            $.get('./image/actor.svg', function(ret){
                this.processing--;
                this.setResource("actor", ret)
            }.bind(this), 'text');

            $.get('./image/control.svg', function(ret){
                this.processing--;
                this.setResource("control", ret)
            }.bind(this), 'text');

            $.get('./image/entity.svg', function(ret){
                this.processing--;
                this.setResource("entity", ret)
            }.bind(this), 'text');

            $.get('./image/entity.svg', function(ret){
                this.processing--;
                this.setResource("subEntity", ret)
            }.bind(this), 'text');
        },

        setResource:function(name, res) {
            // Create JointJs element and save in collector of editor's base elements
            this.resources[name] = new joint.shapes.basic.Image({
                // Size of the element
                size: {
                    width: 100,
                    height: 100
                },
                // Position of the element
                position: {
                    x: 0,
                    y: 0
                },
                attrs: {
                    // This is what user see, so size, image, and aspect ratio.
                    image: {
                        width: 100,
                        height: 100,
                        'xlink:href': 'data:image/svg+xml;utf8,' + encodeURIComponent(res),
                        preserveAspectRatio: 'xMinYMin slice'
                    },
                    // Text under element
                    text: { 'font-size': 14, 'ref-x': .5, 'ref-y': -2, ref: 'image', 'y-alignment': 'middle', 'x-alignment': 'middle', 'text': name },
                    // Type
                    elementType: {name: name}
                }
            });

            // We have to set an input and output port for linking...
            this.resources[name].set('inPorts', ['in']);
            this.resources[name].set('outPorts', ['out']);

            // if no more process are running we can load queued elements
            if (this.processing === 0) {
                if (this.queueElements.length > 0) {
                    for (let key in this.queueElements) {
                        let el = this.queueElements[key];
                        this.newElement(el.elem, el.x, el.y, el.name);
                    }
                }
            }
        },

        initializeEditor: function(disabled = false) {
            let element = this.$el;
            // Initializing
            this.graph = new joint.dia.Graph;
            this.paper = new joint.dia.Paper({
                el: this.$el,
                width: element.width(),
                height: element.height(),
                gridSize: 5,
                model: this.graph,
                linkPinning: false,
                interactive: (disabled ? false : {
                    vertexAdd: false,
                    arrowheadMove: false
                }),
                clickThreshold: 1,
            });

            this.paper.on('cell:pointerclick', function(cellView){this.eventSelectElement(cellView)}.bind(this));
            this.paper.on('cell:pointerdblclick', function(cellView){this.eventDoubleClick(cellView)}.bind(this));

            this.loadResources();
        }
    });
})(jQuery);