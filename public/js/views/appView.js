var app = app || {};
var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#editor-view').html()),
        projectName: '',
        currentDiagram: false,
        focusedEntity: false,
        zoomedEntity: false,
        entityNameCounter: -1,
        mainDiagram: '',
        supportCounterZoom: 0,

        events: {
            'input .selected-element': 'eventNameChange',
            'click .delete-element': 'eventDeleteElement',
            'click .exit-zoom': 'zoomExit',
            'click .save-export': 'eventOpenExportPage',
            'click .save-project': 'eventSave',
            'click .export-project': 'eventExport',
            'click .back': 'eventClose'
        },

        initialize: function() {
            this.state = app.AppStates.IDLE;
            this.elementToolbar = new app.ElementToolbarView();
            this.dataToolbar = new app.DataToolbarView();
            this.robustnessDiagramView = new app.RobustnessDiagramView();
            this.currentDiagram = this.robustnessDiagramView;
            this.entities = new app.Entities();

            // Initialize elements
            this.$el.html(this.template);
            this.$projectName = this.$('.project-name');
            this.$breadcrumbs = this.$('.breadcrumbs');
            this.$selectedElement = this.$('.selected-element');
            this.$parentElement = this.$('.element-parent');
            this.$editorContainer = this.$('.editor-container');
            this.$zoomExitBtn = this.$('.exit-zoom');
            this.$exportPage = this.$('.export-project-page');

            // Adding toolbars
            this.$toolbarElements = this.$('.toolbar-elements');
            this.$toolbarElements.html(this.elementToolbar.render());
            this.$toolbarData = this.$('.toolbar-data');
            this.$toolbarData.html(this.dataToolbar.render());
            this.$robustnessDiagramView = this.$('.editor');
            this.$robustnessDiagramView.html(this.robustnessDiagramView.render());

            // Observers
            this.listenTo(this.robustnessDiagramView, 'selectElement', this.observeFocusElement);
            this.listenTo(this.robustnessDiagramView, 'enterZoom', this.zoomEnter);
            this.listenTo(this.elementToolbar, 'newElement', this.observeNewElement);
        },

        render: function() {
            this.$editorContainer.height(0);
            // Metto un timeout perchè gli elementi ancora non sono renderizzati e non hanno altezza
            setTimeout(function() {
                this.renderEditor();
            }.bind(this), 0);
            return this.$el;
        },

        renderEditor: function() {
            let editorHeight = helper.getContentHeight()
                - this.$projectName.outerHeight()
                - this.$breadcrumbs.outerHeight()
                - 40;
            this.$editorContainer.height(editorHeight);
            this.currentDiagram.setPaperDimensions(this.$robustnessDiagramView.innerWidth(), editorHeight);
        },

        loadData: function(data) {
            // Timeout for giving browser time to render
            setTimeout(function() {
                debugger;
                this.entities.reset(data.entities, {
                    parse: true // tell the collection to parse the data
                });
                this.robustnessDiagramView.fromJSON(data.graph);
            }.bind(this), 0);
        },

        setProjectName: function(name) {
            this.projectName = name;
            this.$projectName.val(this.projectName);
        },

        setNameParent: function(name){
            this.$parentElement.html(name);
        },

        eventOpenExportPage: function () {
            this.$exportPage.addClass('show');
        },

        eventSave: function () {
            var element = document.createElement('a');
            var toExport = {
                'name': this.projectName,
                'entities': this.entities,
                'graph': this.robustnessDiagramView.getGraph()
            };
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(toExport)));
            element.setAttribute('download', this.projectName + '.pro');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },

        eventExport: function () {
            let toSend = JSON.stringify(this.entities);

            let form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", '/export');
            form.setAttribute("target", '_blank');

            // dati entities
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = "data";
            input.value = toSend;
            form.appendChild(input);

            // nome progetto
            let name = document.createElement('input');
            name.type = 'hidden';
            name.name = 'name';
            name.value = this.projectName;
            form.appendChild(name);

            // dati .pro
            let toExport = {
                'name': this.projectName,
                'entities': this.entities,
                'graph': this.robustnessDiagramView.getGraph()
            };
            let pro = document.createElement('input');
            pro.type = 'hidden';
            pro.name = 'pro';
            pro.value = JSON.stringify(toExport);
            form.appendChild(pro);

            document.body.appendChild(form);

            form.submit();

            document.body.removeChild(form);
        },

        eventCompile: function () {
            let toSend = JSON.stringify(this.entities);
            // TODO: da sistemare
            // Json call to server, sending our stringify graph
            $.ajax({
                url: '/compile',
                type: 'post',
                data: toSend,
                contentType: 'application/json',
                dataType: 'json',
                success: function(response) {
                    // On success we have to receive back same data
                    //receivedJSON = data;
                    console.log(response);
                },
                error: function () {
                    // If call don't go well
                    console.log("Error");
                }
            })

        },

        eventNameChange: function () {
            let newName = this.$selectedElement.val().toString();
            let type = this.focus.model.attributes.attrs.elementType.name;
            console.log(type);

            // Se è un'entity allora devo cambiare nome anche sulla collezione
            if (this.state === app.AppStates.IDLE) {
                if (type === 'entity') {
                    let element = this.entities.findWhere({name: this.focus.model.attributes.attrs.text.text});
                    element.setName(newName);
                }

                this.focus.model.attr('text/text', newName);
            }
            if (type === 'subEntity' && this.state === app.AppStates.ZOOM) {
                let element = (this.focusedEntity.get('subEntities')).findWhere({name: this.focus.model.attributes.attrs.text.text});
                element.setName(newName);

                this.focus.model.attr('text/text', newName);
            }
        },

        eventDeleteElement: function () {
            let type = this.focus.model.attributes.attrs.elementType.name;

            if (this.state === app.AppStates.IDLE) {
                if (type === 'entity') {
                    let toRemove = this.entities.findWhere({name: this.focus.model.attributes.attrs.text.text});
                    if (toRemove)
                        toRemove.destroy();
                }
                this.focus.model.remove();
                this.$selectedElement.val('');
            }
            if (type === 'subEntity' && this.state === app.AppStates.ZOOM) {
                let toRemove = (this.focusedEntity.get('subEntities')).findWhere({name: this.focus.model.attributes.attrs.text.text});
                if (toRemove)
                    toRemove.destroy();
                this.focus.model.remove();
                this.$selectedElement.val('');
            }
        },

        observeNewElement: function (element) {
            if (this.state === app.AppStates.IDLE && element === 'link') {
                this.state = app.AppStates.LINKSTATE1;
                this.$selectedElement.attr('disabled','disabled');
                this.$selectedElement.val('Seleziona primo elemento');
                return true;
            }

            let name = element;
            let position = {posX: 0, posY: 0};
            if (element === 'entity' || element === 'subEntity') {
                let target = this.entities;

                if (this.state === app.AppStates.ZOOM) {
                    let baseX = Math.floor(this.$robustnessDiagramView.width() / 2) - 50;
                    let baseY = 230;//Math.floor(this.$robustnessDiagramView.height() / 2) - 50;
                    position = helper.positionAroundFather(this.supportCounterZoom, baseX, baseY);
                    this.supportCounterZoom++;

                    target = this.focusedEntity.get('subEntities');
                    let counter = 0;
                    let fetched = target.where({name: 'SubEntity' + counter});
                    while (fetched.length > 0) {
                        counter++;
                        fetched = target.where({name: 'SubEntity' + counter});
                    }
                    name = 'SubEntity' + counter;
                }else {
                    this.entityNameCounter++;
                    let fetched = target.where({name: 'Entity' + this.entityNameCounter});
                    while (fetched.length > 0) {
                        this.entityNameCounter++;
                        fetched = target.where({name: 'Entity' + this.entityNameCounter});
                    }
                    name = 'Entity' + this.entityNameCounter;
                }

                let newE = new app.Entity();
                newE.setName(name);
                target.add(newE);
            }

            if (element !== 'link') {
                var insertedElement = this.currentDiagram.newElement(element, name, position.posX, position.posY);

                // se sono in zoom devo mettere il link io
                if (this.state === app.AppStates.ZOOM && element === 'subEntity')
                    this.currentDiagram.newLink({model: insertedElement}, {model:this.zoomedEntity});
            }
        },

        zoomExit() {
            this.currentDiagram.remove();
            this.currentDiagram = this.robustnessDiagramView = new app.RobustnessDiagramView();

            setTimeout(function() {
                this.currentDiagram.fromJSON(JSON.parse(this.mainDiagram));
            }.bind(this), 0);

            this.listenTo(this.currentDiagram, 'selectElement', this.observeFocusElement);
            this.listenTo(this.currentDiagram, 'enterZoom', this.zoomEnter);
            this.$robustnessDiagramView.html(this.currentDiagram.render());
            this.elementToolbar.manageElements(true, true, true, true, true, false);
            this.$selectedElement.val('');
            this.setNameParent('');
            this.$editorContainer.removeClass('zoom-mode');
            this.$zoomExitBtn.removeClass('show');
            this.focusedEntity = false;
            this.state = app.AppStates.IDLE;
            this.render();
        },

        zoomEnter(element) {

            //TODO: cambio link, dev'essere entity se no niente
            // If it's a link just skip
            //console.log(element.model.attributes.type);
            if (element.model.attributes.type !== 'devs.Link' && element.model.attributes.attrs.elementType.name === 'entity') {
                let elementName = element.model.attributes.attrs.text.text;
                //this.focus = element;
                this.$selectedElement.val('');
                this.focusedEntity = this.entities.findWhere({name: elementName});
                this.dataToolbar.eventLoadEntity(this.focusedEntity);

                this.mainDiagram = JSON.stringify(this.currentDiagram.getGraph());
                this.currentDiagram = new app.RobustnessDiagramView(true);
                // Observers
                this.listenTo(this.currentDiagram, 'selectElement', this.observeFocusElement);
                //this.listenTo(this.currentDiagram, 'enterZoom', this.zoomEnter);
                this.$robustnessDiagramView.html(this.currentDiagram.render());
                this.elementToolbar.manageElements(false, false, false, false, false, true);
                this.setNameParent(elementName);
                //this.$selectedElement.val('');
                this.$editorContainer.addClass('zoom-mode');
                this.$zoomExitBtn.addClass('show');
                this.state = app.AppStates.ZOOM;


                // Load data of base Entity
                setTimeout(function () {
                    // Construct zoom diagram
                    //this.observeFocusElement(this.focus);
                    console.log(this.$editorContainer);
                    let baseX = Math.floor(this.$robustnessDiagramView.width() / 2) - 50;
                    let baseY = 230;// Math.floor(this.$robustnessDiagramView.height() / 2) - 50;
                    this.zoomedEntity = this.currentDiagram.newElement('entity', this.focusedEntity.getName(), baseX, baseY);

                    // Ciclo le sotto entità
                    let subEntities = this.focusedEntity.get('subEntities');
                    for (let k = 0; k < subEntities.length; k++) {
                        let current = subEntities.models[k];

                        let position = helper.positionAroundFather(k, baseX, baseY);

                        let insertedElement  = this.currentDiagram.newElement('subEntity', current.getName(), position.posX, position.posY);

                        // devo mettere il link
                        this.currentDiagram.newLink({model: insertedElement}, {model:this.zoomedEntity});
                    }
                    this.supportCounterZoom = subEntities.length;

                    //this.observeFocusElement(this.focus);
                }.bind(this), 0);
                this.render();
            }
        },

        observeFocusElement: function (element) {
            // If it's a link just skip
            if (element.model.attributes.type === "devs.Link")
                return false;

            // If we are in zoom and this element is Base entitity we have to disable name input
            let type = element.model.attributes.attrs.elementType.name;
            this.$selectedElement.prop('disabled', (this.state === app.AppStates.ZOOM && type === 'entity'));

            let elementName = element.model.attributes.attrs.text.text;
            switch (this.state) {
                case app.AppStates.ZOOM:
                    this.focus = element;
                    console.log(this.focusedEntity);
                    if ( this.focusedEntity === this.entities.findWhere({name: elementName}) )
                        this.dataToolbar.eventLoadEntity(this.focusedEntity);
                    else
                        this.dataToolbar.eventLoadEntity((this.focusedEntity.get('subEntities')).findWhere({name: elementName}));
                    this.$selectedElement.val(elementName);
                    break;//aggiunto break; Iris 28/05 23:50
                case app.AppStates.IDLE:
                    this.focus = element;
                    this.$selectedElement.val(elementName);
                    break;

                case app.AppStates.LINKSTATE1:
                    this.$selectedElement.val('Seleziona secondo elemento');
                    this.focus = element;
                    this.state = app.AppStates.LINKSTATE2;
                    break;

                case app.AppStates.LINKSTATE2:
                    // If same element just sai it to user and ignore this link
                    if (this.focus.model.attributes.id.toString() === element.model.attributes.id.toString()) {
                        this.$selectedElement.removeAttr('disabled');
                        this.$selectedElement.val('Impossibile creare un link con sorgente e destinazione uguale');
                    } else {
                        if(this.currentDiagram.newLink(this.focus, element)) {
                            this.$selectedElement.removeAttr('disabled');
                            this.$selectedElement.val("Perfetto! Link creato");
                        }
                        else
                            this.$selectedElement.val("Errore! Questi due elementi non possono essere collegati");
                    }

                    // back to IDLE state
                    this.focus = false;
                    this.state = app.AppStates.IDLE;
                    break;
            }
        },

        eventClose: function() {
            this.$exportPage.removeClass('show');
        }
    });
})(jQuery);