var app = app || {};

(function () {
    'use strict';

    app.SubentitiesError = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize :function () {

            let error1 = new app.ErrorModel();
            error1.setName('Nome Subentity multiplo, sono presenti più Subentity con lo stesso nome');
            error1.setDescription('Sono presenti subentità con lo stesso nome');
            error1.setSolution(function(subentities) {
                let subentity;
                let names= [];
                for(let i=0; i<subentities.length; i++) {
                    subentity = subentities.models[i];
                    if (names.indexOf(subentity.getName().toLowerCase()) !== -1) {
                        let num=0;
                        let entityName=subentity.getName().toLowerCase();
                        let sent=true;
                        let newName;
                        while(sent === true){
                            newName = entityName + num;
                            if (names.indexOf(newName.toLowerCase()) === -1) {
                                subentity.setName(newName.toLowerCase());
                                sent=false;
                            }
                            else{
                                num++;
                            }
                        }
                    }
                    names.push(subentity.getName().toLowerCase());
                }
            })
            error1.setValidator(function (subentities) {
                let subentity;
                let names= [];
                let counter=0;

                for(let i=0; i<subentities.length; i++) {
                    subentity = subentities.models[i];
                    if (names.indexOf(subentity.getName().toLowerCase()) !== -1) {
                        counter++;
                    }
                    names.push(subentity.getName().toLowerCase());
                }
                return counter === 0;

            });

            this.add(error1);
        }
    });
})();