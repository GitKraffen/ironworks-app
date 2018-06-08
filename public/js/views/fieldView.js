var app = app || {};

(function ($) {
    'use strict';

    app.FieldView = Backbone.View.extend({
        tagName: 'li',
        className: 'field-row full-row',
        template: _.template($('#field-view').html()),

        events: {
            'change .field-property': 'eventPropertySelect',
            'change .field-type': 'eventTypeSelect',
            'change .field-name': 'eventNameChange',
            'change .field-length': 'eventLengthChange',
            'change .field-default': 'eventDefaultChange',
            'click .field-remove': 'eventRemove'
        },

        initialize: function(attributeNumber) {
            // Initialize
            this.attribute = new app.Attribute();

            this.$el.html(this.template({'fieldNumber':attributeNumber}));

            this.$setFieldProperty = this.$('.field-property');
            this.$setFieldType = this.$('.field-type');
            this.$setFieldName = this.$('.field-name');
            this.$setFieldLenght = this.$('.field-length');
            this.$setFieldDefault = this.$('.field-default');
            this.$setFieldRemove = this.$('.field-view');
        },

        render: function() {
            return this.$el;
        },

        loadAttribute: function(attributeModel) {
            this.attribute = attributeModel;

            // Settare la grafica in base ai dati
            this.$setFieldName.val(this.attribute.getName());
            this.$setFieldLenght.val(this.attribute.getLength());
            this.$setFieldType.val(this.attribute.getType());
            this.$setFieldDefault.val(this.attribute.getdefault());
            console.log(1);
            console.log(this.attribute.getdefault());

            this.$('.field-property').each(function( i, item ) {
                let chkbox = $(item);
                chkbox.prop( "checked", this.attribute.getProperty(chkbox.attr('value')) );
                let appo = this.attribute.getProperty(chkbox.attr('value'));
                if (appo)
                    this.$('.field-label[for="'+chkbox.attr('id')+'"]').addClass('checked');


            }.bind(this));
        },

    eventPropertySelect: function(event) {
        let $element = $(event.target);
        console.log($element);
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
            // TODO: da fare
        },

        eventTypeSelect: function() {
            // TODO: ENUM da mettere
            this.attribute.setType(this.$setFieldType.val());
        },

        eventNameChange: function() {
            this.attribute.setName(this.$setFieldName.val());
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
        }

    });
})(jQuery);