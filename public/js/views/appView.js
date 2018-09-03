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
		dragStartPosition: {},

        events: {
            'click .selected-element' : 'highlightElement',
            'input .selected-element': 'eventNameChange',
            'click .delete-element': 'eventDeleteElement',
            'click .exit-zoom': 'zoomExit',
            'click .save-export': 'eventOpenExportPage',
            'click .save-project': 'eventSave',
            'click .export-project': 'eventExport',
            'click .compile-code': 'eventCompile',
            'click .back': 'eventClose',
        },

        initialize: function() {
            this.state = app.AppStates.IDLE;
            this.elementToolbar = new app.ElementToolbarView();
            this.dataToolbar = new app.DataToolbarView();
            this.robustnessDiagramView = new app.RobustnessDiagramView();
            this.mainDiagram = this.currentDiagram = this.robustnessDiagramView;
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
            this.$mainRDV = this.$('.editor-main'); // Main Robustness Diagram View
            this.$zoomRDV = this.$('.editor-zoom'); // Zoom Robustness Diagram View
            this.$currentEditorContainer = this.$mainRDV;
            this.$currentEditorContainer.html(this.robustnessDiagramView.render());
            this.$el.append(app.errorView.render());

            // Observers
            this.listenTo(this.robustnessDiagramView, 'selectElement', this.observeFocusElement);
            this.listenTo(this.robustnessDiagramView, 'enterZoom', this.zoomEnter);
            this.listenTo(this.elementToolbar, 'newElement', this.observeNewElement);
			
			this.listenTo(this.robustnessDiagramView,'pointerdown',this.pointDown);
			this.listenTo(this.robustnessDiagramView,'pointerup',this.pointUp);
			this.listenTo(this.robustnessDiagramView,'drag',this.drag);

            this.listenTo(app.errorView, 'closing', this.render);
            this.listenTo(app.errorFixer, 'something fixed', this.eventCompile);

            this.listenTo(this.dataToolbar, 'setRelation', this.observeSetRelation);
        },

        render: function() {
            // Metto un timeout perchè gli elementi ancora non sono renderizzati e non hanno altezza
            setTimeout(function() {
                this.renderEditor();
            }.bind(this), 1);
            return this.$el;
        },

        renderEditor: function() {
            let editorHeight = helper.getContentHeight()
                - this.$projectName.outerHeight()
                - this.$breadcrumbs.outerHeight()
                - 30;
            if (app.errorView.isOpened())
                editorHeight -= 220;
            this.$editorContainer.height(editorHeight);
            this.currentDiagram.setPaperDimensions(this.$currentEditorContainer.innerWidth() -1, editorHeight);
        },

        loadData: function(data) {
            // Timeout for giving browser time to render
            setTimeout(function() {
                this.robustnessDiagramView.fromJSON(data.graph,{parse: true});
            }.bind(this), 0);
        },
        setProjectName: function(name) {
            this.projectName = name;
            this.$projectName.html(this.projectName);
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
                'name': this.projectName.replace(/\s/g, ''),
                'entities': this.mainDiagram.getEntitiesJSON(),
                'graph': this.mainDiagram.getGraph().toJSON()
            };
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(toExport)));
            element.setAttribute('download', this.projectName.replace(/\s/g, '') + '.pro');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },

        eventExport: function () {
            app.errorView.clear();
            let validator = new app.DataValidator(this.mainDiagram);
            if(validator.validate() !== true){
                app.errorView.show();
                this.render();
            }else {

                let toSend = JSON.stringify(this.mainDiagram.getEntitiesJSON());

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
                name.value = this.projectName.replace(/\s/g, '');
                form.appendChild(name);

                // dati .pro
                let toExport = {
                    'name': this.projectName.replace(/\s/g, ''),
                    //'entities': this.entities,
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
            }

            this.$exportPage.removeClass('show');
        },

        clear: function(){
            if(this.state === app.AppStates.ZOOM){
                this.zoomExit();
            }
            this.zoomedEntity = false;
            this.focus=false;
        },

        validateData: function(){
            app.errorView.clear();
            this.clear();
            let validator = new app.DataValidator(this.mainDiagram);
            if(validator.validate() !== true){
                app.errorView.show();
                this.render();
                return false;
            }
            return true;
        },

        eventCompile: function () {
            if(!this.validateData()){
                return;
            }

            let toSend = JSON.stringify({
                'name': this.projectName,
                'graph': this.robustnessDiagramView.getGraph()});
            var t = this;
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
                    app.errorView.clear();
                    app.errorView.newError('G.General.0', false);
                    app.errorView.show();
                    t.render();
                }.bind(t),
                error: function () {
                    // If call don't go well
                    console.log("Error");
                }
            })

        },

        eventNameChange: function () {
            let newName = this.$selectedElement.val().toString();
			let namelength = newName.length;

			if (["standard.BasicLink"].includes(this.focus.model.getType())){
			    this.focus.model.setLabelText(newName);
			}else{
                let type = this.focus.model.getType();
                if (type === 'entity') {
                    if (newName === 'lisp')
                        this.focus.model.attr('image/xlink:href', "ee/1");
                    else
                        this.focus.model.attr('image/xlink:href', "image/entity.png");
                }
                this.focus.model.setName(newName);
			}
        },

        eventDeleteElement: function () {
            let type = this.focus.model.getType();
            let name = this.focus.model.getName();

            if (this.state === app.AppStates.IDLE) {
                if(this.mainDiagram.checkLink(this.focus) === false){
                    app.errorView.clear();
                    app.errorView.newError('G.General.3', false);
                    app.errorView.show();
                    app.router.currentView.render();
                }
                else{
                    let model = this.focus.model;
                    model.trigger('destroy', model, model.collection);
                    this.$selectedElement.val('');
                }
            }
            if (type === 'subEntity' && this.state === app.AppStates.ZOOM) {
                let model = (this.focusedEntity.getSubEntities()).findWhere({name: name});
                model.trigger('destroy', model, model.collection);
                this.focus.model.remove();
                this.$selectedElement.val('');
            }                
        },

        observeNewElement: function (data) {
            let insertedElement = false;
            let element = data.elementType;
            if (this.state === app.AppStates.IDLE && element === 'link') {
                this.state = app.AppStates.LINKSTATE1;
                this.$selectedElement.attr('disabled','disabled');
                this.$selectedElement.val('Seleziona primo elemento');
                return true;
            }

            let offset = this.currentDiagram.getOffset();
            let dimension = this.currentDiagram.getSize();
			
			if(element !== 'subEntity'){
				if((offset.x > data.posX) ||
					(offset.y > data.posY) ||
					(offset.x + dimension.width < data.posX) ||
					(offset.y + dimension.height < data.posY)) {
					return false;
				}
			}
            let x = data.posX - 35;
            let y = data.posY - 35;

            let name = element;
            let position = {posX: x - offset.x, posY: y - offset.y};
            if (element === 'entity' || element === 'subEntity') {
                if (this.state === app.AppStates.ZOOM) {
                    let parentPosition = this.zoomedEntity.position();
                    let baseX = parentPosition.x;//Math.floor(this.$currentEditorContainer.width() / 2) - 50;
                    let baseY = parentPosition.y;//230;//Math.floor(this.$currentEditorContainer.height() / 2) - 50;
                    position = helper.positionAroundFather(this.supportCounterZoom, baseX, baseY);
                    this.supportCounterZoom++;

                    let target = this.focusedEntity.getSubEntities();
                    let counter = 0;
                    let fetched = target.where({name: 'SubEntity' + counter});
                    while (fetched.length > 0) {
                        counter++;
                        fetched = target.where({name: 'SubEntity' + counter});
                    }
                    name = 'SubEntity' + counter;

                    insertedElement = this.currentDiagram.newElement(element, name, position.posX, position.posY);
                    target.add(insertedElement);
                    this.currentDiagram.newLinkZoom({model: insertedElement}, {model:this.zoomedEntity});
                }else {
                    this.entityNameCounter++;
                    let fetched = this.currentDiagram.getEntity('Entity' + this.entityNameCounter);
                    while (fetched.length > 0) {
                        this.entityNameCounter++;
                        fetched = this.currentDiagram.getEntity('Entity' + this.entityNameCounter);
                    }
                    name = 'Entity' + this.entityNameCounter;
                    insertedElement = this.currentDiagram.newElement(element, name, position.posX, position.posY);
                }

            }else if (element !== 'link') {
                insertedElement = this.currentDiagram.newElement(element, name, position.posX, position.posY);
            }
            //this.observeFocusElement(insertedElement);
        },

        observeSetRelation: function(data) {
            let relationType = data.type;
            let links = this.currentDiagram.getLinksOfElement(this.focus);
            let arrayLength = links.length;
            for (let i = 0; i < arrayLength; i++) {
                let link = links[i];
                this.setRelation(link, relationType);
            }
        },

        setRelation: function(target, relation) {
            if (relation === '1-1')
                target.setRelation11();
            else if (relation === '1-N')
                target.setRelation1N();
            else
                console.log('ERR - relazione \'' + relation + '\' non valida');
        },

        zoomExit() {
            this.currentDiagram.remove();
            this.currentDiagram = this.mainDiagram;
            this.$currentEditorContainer = this.$mainRDV;

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
            if (element.model.getType() === 'entity') {
                let elementName = element.model.getName();
                this.$selectedElement.val('');
                this.focusedEntity = this.focus.model;
                this.dataToolbar.eventLoadEntity(this.focusedEntity);

                this.mainDiagram = this.currentDiagram;

                this.currentDiagram = new app.RobustnessDiagramView(true);
                // Observers
                this.listenTo(this.currentDiagram, 'selectElement', this.observeFocusElement);

                this.$currentEditorContainer = this.$zoomRDV;

                this.$currentEditorContainer.html(this.currentDiagram.render());
                this.elementToolbar.manageElements(false, false, false, false, false, true);
                this.setNameParent(elementName);
                this.$editorContainer.addClass('zoom-mode');
                this.$zoomExitBtn.addClass('show');
                this.state = app.AppStates.ZOOM;

                // Load data of base Entity
                setTimeout(function () {
                    // Construct zoom diagram
                    let baseX = Math.floor(this.$currentEditorContainer.width() / 2) - 50;
                    let baseY = 220;// Math.floor(this.$currentEditorContainer.height() / 2) - 50;
                    this.zoomedEntity = this.currentDiagram.addElement(this.focusedEntity.clone(), baseX, baseY);

                    // Ciclo le sotto entità
                    let subEntities = this.focusedEntity.getSubEntities();
                    for (let k = 0; k < subEntities.length; k++) {
                        let current = subEntities.at(k);

                        let position = helper.positionAroundFather(k, baseX, baseY);

                        //let insertedElement  = this.currentDiagram.newElement('subEntity', current.getName(), position.posX, position.posY);
                        this.currentDiagram.addElement(current, position.posX, position.posY);

                        // devo mettere il link
                        let link = this.currentDiagram.newLinkZoom({model: current}, {model:this.zoomedEntity});

                        // imposto le relazioni delle sotto entità
                        let relationType = '1-1';
                        let counted = current.countPK();
                        if (counted > 0)
                            relationType = '1-N';
                        this.setRelation(link, relationType);
                    }
                    this.supportCounterZoom = subEntities.length;
                }.bind(this), 25);
                this.render();
            }
        },

        observeFocusElement: function (element) {
            if(["standard.RelationLink"].includes(element.model.getType()))
                return;
            this.currentDiagram.unhighlight();

            if (["standard.BasicLink"].includes(element.model.getType())){
                element.model.highlightLink();
                this.focus = element;
                this.$selectedElement.prop('disabled', false);
                this.$selectedElement.val(element.model.getLabelText());
            }else{
                // If we are in zoom and this element is Base entitity we have to disable name input
                let type = element.model.getType();
                this.$selectedElement.prop('disabled', (this.state === app.AppStates.ZOOM && type === 'entity'));

                let elementName = element.model.getName();
                switch (this.state) {
                    case app.AppStates.ZOOM:
                        this.currentDiagram.highlight(element);

                        this.focus = element;

                        if ( element.model.getType() === 'entity' )// this.entities.findWhere({name: elementName}) )
                            this.dataToolbar.eventLoadEntity(this.focusedEntity);
                        else
                            this.dataToolbar.eventLoadEntity(this.focus.model);
                        this.$selectedElement.val(elementName);
                        break;//aggiunto break; Iris 28/05 23:50
                    case app.AppStates.IDLE:
                        this.currentDiagram.highlight(element);

                        this.focus = element;
                        this.$selectedElement.val(elementName);
                        
                        break;

                    case app.AppStates.LINKSTATE1:
                        this.$selectedElement.val('Seleziona secondo elemento');

                        this.currentDiagram.highlight(element);

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

                                this.currentDiagram.highlight(element);

                            }
                            else{
                                this.$selectedElement.val("Errore! Questi due elementi non possono essere collegati");
                                app.errorView.clear();
                                app.errorView.newError('G.General.2', false);
                                app.errorView.show();
                            }
                            app.router.currentView.render();
                        }

                        // back to IDLE state
                        this.focus = false;
                        this.state = app.AppStates.IDLE;
                        break;
                }
            }
            //this.$selectedElement.focus();
        },

        eventClose: function() {
            this.$exportPage.removeClass('show');
        }
    });
})(jQuery);
