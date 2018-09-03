var app = app || {};

(function ($) {
    'use strict';

    app.DataToolbarView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#toolbar-data-view').html()),
        currentEntity: false,
        counterAttributes: 0,

        events: {
            'click .new-field': 'eventNewField'
        },

        initialize: function() {
            // Initialize
            this.attributes = new app.Attributes();

            this.$el.html(this.template);
            this.$container = this.$('.fields-container');
        },

        render: function() {
            return this.$el;
        },

        eventNewField: function() {
            if (this.currentEntity) {
                let newField = new app.FieldView(this.counterAttributes,false);
                this.counterAttributes++;
                let newFieldModel = new app.Attribute();
                this.currentEntity.get('attr').add(newFieldModel);
                newField.loadAttribute(newFieldModel);
                this.addFieldView(newField);
                newField.focusName();
            }
        },

        eventLoadEntity: function(entity) {
            this.$container.html('');
            this.currentEntity = entity;
            let attributes = this.currentEntity.getAttributes();
            let howMany = attributes.length;

            for(var i=0; i<howMany; i++) {
                let attribute = attributes.models[i];
                let newField = new app.FieldView(this.counterAttributes, howMany>2);
                this.counterAttributes++;
                newField.loadAttribute(attribute);
                this.addFieldView(newField);
            }
        },

        addFieldView: function(newField) {
            this.$('.fields-container').append(newField.render());
            this.listenTo(newField, 'pkChanged', this.checkRelation);
        },

        checkRelation: function(target = false) {
            if (target === false)
                target = this.currentEntity;

            if (target.getType() === 'entity')
                return;

            let counted = target.countPK();
            if (counted > 0)
                this.trigger('setRelation', {type: '1-N'});
            else
                this.trigger('setRelation', {type: '1-1'});
        }
    });
})(jQuery);