var app = app || {};

(function () {
    'use strict';

    app.Attributes = Backbone.Collection.extend({
        model: app.Attribute
    });
})();