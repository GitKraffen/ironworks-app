var app = app || {};

(function ($) {
    'use strict';

    app.FieldView = Backbone.View.extend({
        tagName: 'li',
        className: 'field-row full-row',
        template: _.template($('#field-view').html()),

        events: {
            'change .field-property': 'eventPropertySelect',
            'keydown .field-label': 'test',
            'change .field-type': 'eventTypeSelect',
            'keyup .field-name': 'eventNameChange',
            'keyup .field-length': 'eventLengthChange',
            'keyup .field-default': 'eventDefaultChange',
            'click .field-remove': 'eventRemove',
            'click .field-label-name' : 'eventOpenAttribute',
            'click .hidden-attribute' : 'eventCloseAttribute'
        },

        initialize: function(attributeNumber,hidden=true) {
            // Initialize
            this.attribute = new app.Attribute();

            this.$el.html(this.template({'fieldNumber':attributeNumber}));
            this.$setFieldProperty = this.$('.field-property');
            this.$setFieldType = this.$('.field-type');
            this.$setFieldName = this.$('.field-name');
            this.$setFieldLabelName = this.$('.field-label-name-content');
            this.$setFieldLenght = this.$('.field-length');
            this.$setFieldDefault = this.$('.field-default');
            this.$setFieldRemove = this.$('.field-view');

            this.$hidden=hidden;
        },

        test: function(e) {
            switch (e.key) {
                case ' ':
                case 'Enter':
                    $(e.target).click().focus();
            }
        },

        render: function() {
            return this.$el;
        },

        loadAttribute: function(attributeModel) {
            this.attribute = attributeModel;

            // Settare la grafica in base ai dati
            this.$setFieldName.val(this.attribute.getName());
            this.$setFieldType.val(this.attribute.getType());
            this.closeLengthButton(this.attribute.getType());
            this.$setFieldDefault.val(this.attribute.getdefault());

            this.$setFieldLabelName.html(this.attribute.getName());

            this.$('.field-property').each(function( i, item ) {
                let chkbox = $(item);
                chkbox.prop( "checked", this.attribute.getProperty(chkbox.attr('value')) );
                if (this.attribute.getProperty(chkbox.attr('value'))) {
                    this.$('.field-label[for="'+chkbox.attr('id')+'"]').addClass('checked');
                    if (chkbox.attr('name') === 'default')
                        this.$setFieldDefault.prop('disabled', false);
                }

            }.bind(this));

            if(this.$hidden === true){
                this.$el.addClass('closed');
            }
        },

        closeLengthButton : function(typeName){
            if (app.fieldTypes[typeName].maxLength !== undefined) {
                this.$setFieldLenght.val(this.attribute.getLength());
                this.$setFieldLenght.removeClass('closed');
            }else
                this.$setFieldLenght.addClass('closed');
        },

        focusName: function() {
            this.$setFieldName.focus().select();
        },

        eventPropertySelect: function(event) {
            let $element = $(event.target);
            // toggle class on label
            let id  = $element.attr('name');
            let $label = this.$('label[for="' + $element.attr('id') + '"]');
            if ($element.is(':checked'))
                $label.addClass('checked');
            else
                $label.removeClass('checked');
            if (id === 'default')
                this.$('.field-default').prop('disabled', !$element.is(':checked'));

            this.attribute.setProperty($element.attr('value'), $element.is(':checked'));

            if (id === 'primarykey')
                this.trigger('pkChanged');
        },

        eventTypeSelect: function() {
            // TODO: ENUM da mettere
            this.attribute.setType(this.$setFieldType.val());
            this.closeLengthButton(this.attribute.getType());
            let type= app.type.findWhere({name: this.attribute.getType()});
            if(type.getCategory() === 'text'){
                this.attribute.setLength('64');
            }
            else{
                this.attribute.setLength(false);
            }
            this.$setFieldLenght.val(this.attribute.getLength());
        },

        eventNameChange: function() {
            this.attribute.setName(this.$setFieldName.val());
            this.$setFieldLabelName.html(this.$setFieldName.val());
        },

        eventLengthChange: function() {
            this.attribute.setLength(this.$setFieldLenght.val());
        },

        eventDefaultChange: function() {
            this.attribute.setDefault(this.$setFieldDefault.val());
        },

        eventRemove: function() {
            //this.$setFieldRemove.remove();
            this.attribute.destroy();
            this.remove();
        },
        eventOpenAttribute: function() {
            this.$el.removeClass('closed');
            this.focusName();
        },
        eventCloseAttribute: function(){
            this.$el.addClass('closed');
        }

    });
})(jQuery);