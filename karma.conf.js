// Karma configuration
// Generated on Tue Jun 12 2018 21:36:11 GMT+0200 (ora legale Europa occidentale)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs', 'chai'],
        
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-requirejs',
            'karma-chrome-launcher'
        ],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'public/index.html',served: true, watched: true, included: false},
            {pattern: 'classes/*.js',served: true, watched: true, included: false},
            {pattern: 'public/js/collections/*.js', included: false},
            {pattern: 'public/js/lib/*.js', included: false},
            {pattern: 'public/js/models/*.js', included: false},
            {pattern: 'public/js/views/*.js', included: false},
            {pattern: 'public/js/app.js', included: false},
            {pattern: 'public/js/helper.js', included: false},
            {pattern: 'public/js/router.js', included: false},
            {pattern: 'node_modules/text/text.js', included: false},
            {pattern: 'test/*.js', included: false},
            {pattern: 'server.js', included: false},
            {pattern: 'serverApplication.js', included: false},
            {pattern: 'serverPresentation.js', included: false},
            'test-main.js'
        ],
        
        bowerPackages: [
            'jquery',
            'jointjs',
            'backbone',
            'lodash'
        ],

        proxies: {

        },

        // list of files / patterns to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors :{

        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 8080,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
