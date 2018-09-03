var app = app || {};

(function ($) {
    'use strict';

    app.RobustnessDiagramView = Backbone.View.extend({
        tagName: 'div',
        graph: false,
        paper: false,
		dragStartPosition: {},

        initialize: function(disabled = false) {
            this.initializeEditor(disabled);
        },

        render: function() {
            return this.$el;
        },

        getGraph: function() {
            return this.graph;
        },

        getOffset: function() {
            var offset = this.$el.offset();
            return {x: offset.left, y: offset.top};
        },

        getSize: function() {
            return {width: this.$el.width(), height: this.$el.height()};
        },
      
        getEntity: function(name) {
            return this.graph.get('cells').where({elementType: "entity", name: name });
        },

        getEntities: function() {
            let asArray = this.graph.get('cells').where({elementType: "entity"});
            let toReturn = new app.Entities();
            asArray.forEach(function (entity) {
                toReturn.add(entity);
            });
            return toReturn;
        },

        getEntitiesJSON: function() {
            return this.getEntities().toJSON();
        },

        fromJSON: function(json, opt) {
            this.graph.fromJSON(json, opt);
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

		eventPointerDown: function(event, x, y){
			this.dragStartPosition = { x: x, y: y};
			//this.trigger('pointerdown',event,x,y);
		},
		eventPointerUp: function(event,x,y){
			delete this.dragStartPosition;
			//this.trigger('pointerup',event,x,y);
		},
		eventDrag: function(event,x,y){
			
			this.time = false;
				let xdrag = this.dragStartPosition.x;
				let ydrag = this.dragStartPosition.y;
				let gra	  = this.getGraph();
				gra.translate(x-xdrag,y-ydrag);
				this.dragStartPosition = { x: x, y: y};
			//this.trigger('drag',event,x,y);
		},
		
		newElement: function(type, name, x = 0, y = 0) {
            let newElement;
            switch (type) {
                case 'actor':
                    newElement = joint.shapes.basic.Actor.new(name, x, y);
                    break;
                case 'boundary':
                    newElement = joint.shapes.basic.Boundary.new(name, x, y);
                    break;
                case 'control':
                    newElement = joint.shapes.basic.Control.new(name, x, y);
                    break;
                case 'entity':
                    newElement = joint.shapes.basic.Entity.new(name, x, y);
                    break;
                case 'subEntity':
                    newElement = joint.shapes.basic.SubEntity.new(name, x, y);
                    break;
                default:
                    console.log('Errore, non posso inserire: '.type);
                    return;
            }
            newElement.setName(name);
            // Add new element in graph
            this.graph.addCells( newElement );
            return newElement;
        },

        addElement: function(element, x, y) {
            element.position(x, y);
            // Add new element in graph
            this.graph.addCells( element );
            return element;
        },
		
		//Link Normale Robustness Diagram
        newLink: function(element1, element2) {
            // If same element just say it to user and ignore this link

            if(helper.areLinkable(element1, element2)) {

                if (element1.model.id === element2.model.id) {
                    // Error same element
                    app.errorView.clear();
                    app.errorView.newError('G.General.2', false);
                    app.errorView.show();
                    app.router.currentView.render();
                } else {
                    // Creating link between two selected elements
                    console.log('creata base');
                    let link = new joint.shapes.standard.BasicLink({
                        source: {
                            id: element1.model.id,
                            port: 'out'
                        },
                        target: {
                            id: element2.model.id,
                            port: 'in'
                        }
                    });

                    // Adding link to graph
                    this.graph.addCell(link);
                    link.toBack();
                    link.attr('line/stroke', '#5654a0');

                    return true;
                }
            }
            return false;
        },
		
		//Link Zoom con relazione 1-1 o 1-N
		newLinkZoom: function(element1, element2) {
            // If same element just say it to user and ignore this link

            if(helper.areLinkable(element1, element2)) {

                if (element1.model.id === element2.model.id) {
                    // Error same element
                    app.errorView.clear();
                    app.errorView.newError('G.General.2', false);
                    app.errorView.show();
                    app.router.currentView.render();
                } else {
                    // Creating link between two selected elements
                    let link = new joint.shapes.standard.RelationLink({
                        source: {
                            id: element1.model.id,
                            port: 'out'
                        },
                        target: {
                            id: element2.model.id,
                            port: 'in'
                        }
                    });
                    link.attr({
                        '.connection': { stroke: '#3c4260', 'stroke-width': 1 }
                    });
                    // Adding link to graph
                    this.graph.addCell(link);
                    link.toBack();

                    return link;
                }
            }
            return false;
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
                //linkView: CustomLinkView,
                linkPinning: false,
                interactive: (disabled ? false : {
                    vertexAdd: false,
                    arrowheadMove: false
                }),
                clickThreshold: 1,
            });

            this.paper.on('cell:pointerclick', function(cellView){this.eventSelectElement(cellView)}.bind(this));
            this.paper.on('cell:pointerdblclick', function(cellView){this.eventDoubleClick(cellView)}.bind(this));

            this.paper.on('blank:pointermove',function(event, x, y) {this.eventDrag(event,x,y);}.bind(this));
            this.paper.on('blank:pointerdown',function(event, x, y) {this.eventPointerDown(event,x,y);}.bind(this));
            this.paper.on('blank:pointerup',  function(event, x, y) {this.eventPointerUp(event,x,y);}.bind(this));
        },

        getLinksOfElement: function(element) {
            return this.graph.getConnectedLinks(element.model);
        },

        unhighlight: function(){
            let papz = this.paper;
            _.each(this.getGraph().getCells(), function(el){
                let t = papz.findViewByModel(el);
                if (["standard.BasicLink"].includes(el.getType())){
                    t.model.unHighlightLink();
                }
                else{
                    t.unhighlight();
                    t.highlighted = false;
                }

            });
        },

        highlight:function(element){
            this.unhighlight();
            element.highlight();
            element.highlighted = true;
        },

        checkLink:function (element){
            let links = this.getLinksOfElement(element);
            if(links.length > 0){
                return false;
            }
            return true;
        }
    });
})(jQuery);