var app = app || {};

(function ($) {
    'use strict';

    let ErrorView  = Backbone.View.extend({
        tagName: 'div',
        className: 'error-toolbar hidden',
        template: _.template($('#error-toolbar').html()),
        //el: '.error-toolbar',

        events: {
            'click .error-back': 'eventClose'
        },

        initialize: function(errorID, subject) {
            // Initialize
            this.$el.html(this.template());
            this.$list = this.$('.error-list');
        },

        render: function() {
            return this.$el;
        },

        newError(errID, target, father) {
            let error = new app.ErrorRowView(errID, target, this, father);
            this.$list.prepend(error.render());
        },

        clear() {
            this.trigger('clearingAll');
        },

        show: function() {
            this.$el.addClass('show');
        },

        eventClose: function() {
            this.$el.removeClass('show');
            this.trigger('closing');
        },

        isOpened() {
            return this.$el.hasClass('show');
        }
    });

    app.errorView = new ErrorView();
})(jQuery);