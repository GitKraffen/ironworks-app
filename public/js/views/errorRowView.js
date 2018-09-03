var app = app || {};

(function ($) {
    'use strict';

    app.ErrorRowView = Backbone.View.extend({
        tagName: 'li',
        className: 'error-row full-row',
        template: _.template($('#error-row').html()),

        events: {
            'click .fix-it': 'eventFix'
        },

        initialize: function(errorID, subject, parent, father = false) {
            // Initialize
            let nameSubject = '';
            if(typeof subject.getName !== 'function') {
                if(father === false){
                    nameSubject='';
                }
                else{
                    nameSubject = father+': ';
                }
            }
            else{
                nameSubject = father+': ';
            }
            this.$el.html(this.template({
                'errorNumber':errorID, 
                'errorSubject': nameSubject,
                'errorName':app.errorFixer.getErrName(errorID),
                'errorDescr':app.errorFixer.getErrDescription(errorID)}),
            );

            this.errorID = errorID;
            this.error = app.errorFixer.getError(errorID);
            if (typeof this.error === undefined)
                return false;
            this.subject = subject;

            if (!this.error.hasSolution())
                this.$('.fix-it').remove();

            this.listenTo(parent, 'clearingAll', this.remove);

            this.$el.addClass('type-' + this.error.getType());
        },

        render: function() {
            return this.$el;
        },

        eventFix() {
            if (app.errorFixer.fixError(this.errorID, this.subject))
                this.remove();
            else {
                console.log('unable to fix err: ' + this.errorID);
                app.errorView.newError('G.General.1', false);
            }
        }
    });
})(jQuery);