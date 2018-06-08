var app = app || {};

(function ($) {
    'use strict';

    app.HomeView = Backbone.View.extend({
        tagName: 'div',
        className: 'full',
        template: _.template($('#landing-page-view').html()),

        events: {
            'click .new-project': 'eventNewProject',
            'click .load-project': 'eventLoadProject',
            'click .set-project-name-send': 'eventCreateProject',
            'click .set-project-file-send': 'eventOpenProject',
            'change .set-project-file': 'eventFileSelected',
            'click .back': 'eventClose'
        },

        initialize: function() {
            // Initialize
            this.$el.html(this.template());

            this.$setProjectName = this.$('.set-project-name');
            this.$loadProjectFile = this.$('.load-project-file');
            this.$projectFilePath = this.$('.set-project-file-label');
            this.$createProjectName = this.$('.set-project-name-val');

            //this.newProjectName = this.$setProjectName.$('.new-project-name');
            this.$input = this.$('#project-file');
        },

        render: function() {
            return this.$el;
        },

        eventNewProject: function() {
            this.$setProjectName.addClass('show');
        },

        eventLoadProject: function() {
            this.$loadProjectFile.addClass('show');
        },

        eventFileSelected: function(e) {
            this.$projectFilePath.html($(e.target).val());
        },

        eventCreateProject: function() {
            let name = this.$createProjectName.val();
            // TODO: controllare se nome va bene per url
            if (name.length > 0) {
                app.router.navigate("new-project/"+name, true);
            }
        },

        eventOpenProject: function() {
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                alert('The File APIs are not fully supported in this browser.');
                return false;
            };

            let input = document.getElementById('project-file');
            console.log(input);
            if (!input.files || !input.files[0]) {
                alert("Please select a file before clicking 'Load'");
            } else {
                let file = input.files[0];
                let fr = new FileReader();
                fr.onload = function() {
                    let data = JSON.parse(fr.result);
                    console.log(data);

                    // TODO: check validity
                    app.router.project.dataToLoad = data;
                    app.router.navigate("new-project/"+data.name, true);
                };
                fr.readAsText( file );
            };

            // TODO: verify if working and proceed with project loading
        },

        eventClose: function() {
            this.$setProjectName.removeClass('show');
            this.$loadProjectFile.removeClass('show');
        }

    });
})(jQuery);