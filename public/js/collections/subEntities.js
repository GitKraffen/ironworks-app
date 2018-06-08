var app = app || {};

(function () {
    'use strict';

    app.SubEntities = Backbone.Collection.extend({
        model: app.SubEntity
    });
})();