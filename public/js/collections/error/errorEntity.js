var app = app || {};

(function () {
    'use strict';

    app.EntityError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize :function () {

            let error1 = new app.ErrorModel();
            error1.setName('Nome Entity nullo, una Entity deve essere fornita di un nome');
            error1.setDescription('Il nome di una entità non può essere nullo');
            error1.setSolution(function(entity) {entity.setName('entity')});
            error1.setValidator(function (entity) {
                return entity.getName() !== '';});

            this.add(error1);

        }
    })
})();
