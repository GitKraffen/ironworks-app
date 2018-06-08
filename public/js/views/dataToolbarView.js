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
                let newField = new app.FieldView(this.counterAttributes);
                this.counterAttributes++;
                let newFieldModel = new app.Attribute();
                this.currentEntity.get('attr').add(newFieldModel);
                newField.loadAttribute(newFieldModel);
                this.$('.fields-container').append(newField.render());
            }
        },
        eventLoadEntity: function(entity) {
            console.log(entity);
            this.$container.html('');
            this.currentEntity = entity;
            let attributes = this.currentEntity.get('attr');

            for(var i=0; i<attributes.length; i++) {
                let attribute = attributes.models[i];
                let newField = new app.FieldView(this.counterAttributes);
                this.counterAttributes++;
                newField.loadAttribute(attribute);
                this.$('.fields-container').append(newField.render());
            }
        }

    });
})(jQuery);