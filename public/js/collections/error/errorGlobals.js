var app = app || {};

(function () {
    'use strict';

    app.ErrorGlobals = Backbone.Collection.extend({
        model: app.ErrorModel,

        initialize :function () {

            let error1 = new app.ErrorModel();
            error1.setName('Compilazione eseguita');
            error1.setDescription('La complilazione del progetto è stata eseguita correttamente');
            error1.setType('log');
            this.add(error1);

            let error2 = new app.ErrorModel();
            error2.setName('Impossibile correggere errore');
            //error2.setDescription('');
            error2.setType('alert');
            this.add(error2);

            let error3 = new app.ErrorModel();
            error3.setName('Impossibile collegare gli elementi');
            error3.setDescription('Collegamento non consentito');
            error3.setType('alert');
            this.add(error3);

            let error4 = new app.ErrorModel();
            error4.setName("Impossibile eliminare l'elemento in quanto ancora collegato ad altri elementi");
            error4.setDescription('Collegamento non consentito');
            error4.setType('log');
            this.add(error4);
        }
    });
})();