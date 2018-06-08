/*global $ */
/*jshint unused:false */
var app = app || {};

(function () {
    'use strict';

    app.exportView = Backbone.View.extend({
        tagName: 'div',
        className: 'ElementToolbar',
        template: _.template($('#toolbar-template').html()),
        el: '#ElementToolbar',

        events: {
            // Events here
            // Empty
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        eventSave: function (e) {

        },

        eventExport: function (elementStatus) {
            
        },

        eventClose: function (elementStatus) {
            
        }
    });
})();