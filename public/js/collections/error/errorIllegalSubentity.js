var app = app || {};

(function () {
    'use strict';

    app.IllegalSubentityError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize: function () {

            let error0 = new app.ErrorModel();
            error0.setName('Nome Subentity illegale, può essere formato solo da lettere o numeri');
            error0.setDescription('Il nome di una Subentity non può essere illegale');
            error0.setSolution(function(subentity) {
                subentity.setName(helper.setLegal(subentity.getName()));
            });
            error0.setValidator(function (subentity) {
                return helper.isLegal(subentity.getName());
            });
            this.add(error0);

        }
    });
})();