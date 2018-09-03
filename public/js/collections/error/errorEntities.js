var app = app || {};

(function () {
    'use strict';

    app.EntitiesError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize :function () {

            let error1 = new app.ErrorModel();
            error1.setName('Nome Entity multiplo, sono presenti più Entity con lo stesso nome');
            error1.setDescription('Sono presenti entità con lo stesso nome');
            error1.setSolution(function(entities) {
                let entity;
                let names= [];
                for(let i=0; i<entities.length; i++) {
                    entity = entities.models[i];
                    if (names.indexOf(entity.getName().toLowerCase()) !== -1) {
                        let num=0;
                        let entityName=entity.getName().toLowerCase();
                        let sent=true;
                        let newName;
                        while(sent === true){
                            newName = entityName + num;
                            if (names.indexOf(newName.toLowerCase()) === -1) {
                                entity.setName(newName.toLowerCase());
                                sent=false;
                            }
                            else{
                                num++;
                            }
                        }
                    }
                    names.push(entity.getName().toLowerCase());
                }
            })
            error1.setValidator(function (entities) {
                let entity;
                let names= [];
                let counter=0;

                for(let i=0; i<entities.length; i++) {
                    entity = entities.models[i];
                    if (names.indexOf(entity.getName().toLowerCase()) !== -1) {
                        counter++;
                    }
                    names.push(entity.getName().toLowerCase());
                }
                return counter === 0;

            });

            this.add(error1);
        }
    });
})();