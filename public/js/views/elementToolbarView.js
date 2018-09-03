/*global $ */
/*jshint unused:false */
var app = app || {};

(function ($) {
    'use strict';

    app.ElementToolbarView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#toolbar-element-view').html()),

        events: {
            'click .clickable': 'eventElementSelect'
        },

        initialize: function() {
            this.$el.html(this.template);

            // Elements
            this.$actor = this.$('[data-element="actor"]');
            this.$boundary = this.$('[data-element="boundary"]');
            this.$control = this.$('[data-element="control"]');
            this.$entity = this.$('[data-element="entity"]');
            this.$subEntity = this.$('[data-element="subEntity"]');
            this.$link = this.$('[data-element="link"]');

            let draggables = this.$('.new-element.draggable').draggable({helper: "clone"});

            draggables.bind('dragstop', function(event, ui) {
                let element = $(event.target);
                if (!element.hasClass('new-element'))
                    element = element.parent();
                this.trigger('newElement', {
                    elementType: element.data('element'),
                    posX: event.clientX,
                    posY: event.clientY
                });
            }.bind(this));

            this.manageElements(true, true, true, true, true, false);
        },

        render: function() {
            return this.$el;
        },

        eventElementSelect: function (e) {
            let element = $(e.target);
            if (!element.hasClass('new-element'))
                element = element.parent();
            if (!element.hasClass('disabled'))
                this.trigger('newElement', {
                    elementType: element.data('element'),
                    posX: 0,
                    posY: 0
                });
        },

        manageElements: function (actor, boundary, control, entity, link, subEnetity) {
            if (actor) this.$actor.removeClass('disabled');
                else this.$actor.addClass('disabled');
            if (boundary) this.$boundary.removeClass('disabled');
                else this.$boundary.addClass('disabled');
            if (control) this.$control.removeClass('disabled');
                else this.$control.addClass('disabled');
            if (entity) this.$entity.removeClass('disabled');
                else this.$entity.addClass('disabled');
            if (link) this.$link.removeClass('disabled');
                else this.$link.addClass('disabled');
            if (subEnetity) this.$subEntity.removeClass('disabled');
            else this.$subEntity.addClass('disabled');
        }
    });
})(jQuery);