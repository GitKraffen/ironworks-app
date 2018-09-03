var app = app || {};

(function () {
    'use strict';

    app.IllegalEntityError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize: function () {

            let error0 = new app.ErrorModel();
            error0.setName('Nome Entity illegale, può essere formato solo da lettere o numeri');
            error0.setDescription('Il nome di una Entity non può essere illegale');
            error0.setSolution(function(entity) {
                entity.setName(helper.setLegal(entity.getName()));
            });
            error0.setValidator(function (entity) {
                return helper.isLegal(entity.getName());
            });
            this.add(error0);

        }
    });
})();