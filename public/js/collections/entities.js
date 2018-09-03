var app = app || {};

(function () {
    'use strict';

    app.Entities = Backbone.Collection.extend({
        model: joint.shapes.basic.Entity
    });
})();