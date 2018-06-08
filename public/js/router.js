var app = app || {};

(function ($) {
    'use strict';

    var ApplicationRouter = Backbone.Router.extend({
        currentView: false,
        project: {},
        $content : {},

        initialize: function() {
            this.$content = $('.main');
        },

        //map url routes to contained methods
        routes: {
            "": "home",
            "new-project/:name": "newProject",
            "editor": "editor",
            "test": "test"
        },

        home: function() {
            if (this.currentView)
                this.currentView.remove();
            this.currentView = new app.HomeView();
            this.$content.html(this.currentView.render());
        },

        newProject: function(name) {
            this.project.name = name;
            app.router.navigate("editor", true);
        },

        editor: function() {
            if (!this.project.name) {
                app.router.navigate("", true);
                return false;
            }
            if (this.currentView)
                this.currentView.remove();
            this.currentView = new app.AppView();
            this.currentView.setProjectName(this.project.name);

            if (this.project.dataToLoad){
                this.currentView.loadData(this.project.dataToLoad);
            }
            //$('.save-export').addClass('show');
            this.$content.html(this.currentView.render());
        },

        test: function() {
            if (this.currentView)
                this.currentView.remove();
            this.currentView = new app.AppView();
            this.currentView.setProjectName('Testing');
            this.$content.html(this.currentView.render());
        }
    });

    app.router = new ApplicationRouter();
    Backbone.history.start();
})(jQuery);
