/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

    app.ElementToolbarView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#toolbar-element-view').html()),

        events: {
            'click .new-element': 'eventElementSelect'
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

            this.manageElements(true, true, true, true, true, false);
        },

        render: function() {
            return this.$el;
        },

        eventElementSelect: function (e) {
            if (!$(e.target).hasClass('disabled'))
                this.trigger('newElement', $(e.target).data('element'));
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
})();