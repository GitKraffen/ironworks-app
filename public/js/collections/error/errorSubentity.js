var app = app || {};

(function () {
    'use strict';

    app.SubentityError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize :function () {

            let error1 = new app.ErrorModel();
            error1.setName('Nome Subentity nullo, una Subentity deve essere fornita di un nome');
            error1.setDescription('Il nome di una subentità non può essere nullo');
            error1.setSolution(function(subentity) {subentity.setName('entity')});
            error1.setValidator(function (subentity) {
                return subentity.getName() !== '';});

            this.add(error1);

        }
    })
})();
