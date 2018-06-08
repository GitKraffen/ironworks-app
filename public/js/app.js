var app = app || {};

(function ($) {
    'use strict';

    app.eventResize = function() {
        let newHeight = helper.getContentHeight();
        $('.main').height(newHeight);
    };

    $( window ).resize(app.eventResize());

    function myConfirmation() {
        return 'Sei sicuro di voler uscire? Perderai tutti i dati non salvati';
    }

    window.onbeforeunload = myConfirmation;

})(jQuery);