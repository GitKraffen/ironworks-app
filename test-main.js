var allTestFiles = []
var TEST_REGEXP = /(spec|test)\.js$/i

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule)
    }
});

requirejs.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    paths: {

        //ClASSES
 /*       'execfile':'classes/execfile',
        'generatorTemplate':'classes/generatorTemplate',
        'javaGenerator':'classes/javaGenerator',
        'javaManagerGenerator':'classes/javaManagerGenerator',
        'sqlGenerator':'classes/sqlGenerator',*/
        

        // COLLECTIONS
        'attributes': 'public/js/collections/attributes',
        'entities': 'public/js/collections/entities',
        'subEntities': 'public/js/collections/subEntities',
        
        // LIBRERIE
        'backbone': 'public/js/lib/backbone',
        'joint': 'public/js/lib/joint',
        'jquery': 'public/js/lib/jquery',
        'lodash': 'public/js/lib/lodash',
        'underscore': 'public/js/lib/underscore',
        'text':'node_modules/text/text',

        // MODELS
        'appStates': 'public/js/models/appStates',
        'attribute': 'public/js/models/attribute',
        'attributeType': 'public/js/models/attributeType',
        'baseEntity': 'public/js/models/baseEntity',
        'elementType': 'public/js/models/elementType',
        //'entity': 'public/js/models/entity',
        //'subEntity': 'public/js/models/subEntity',

        //VIEWS
        'appView' : 'public/js/views/appView',
        'dataToolbarView' : 'public/js/views/dataToolbarView',
        'elementToolbarView' : 'public/js/views/elementToolbarView',
        'exportView' : 'public/js/views/exportView',
        'fieldView' : 'public/js/views/fieldView',
        'homeView' : 'public/js/views/homeView',
        'robustnessDiagramView' : 'public/js/views/robustnessDiagramView',
        
        //ALTRE
        'app': 'public/js/app',
        'helper': 'public/js/helper',
        'router': 'public/js/router'

        //Server
        /*
        'server':'server',
        'serverApplication':'serverApplication',
        'serverPresentation':'serverPresentation'*/
    },
    
    
    shim: {

        // Collections
        'attributes': {
            deps: ['attribute']
        },
        'entities': {
            deps: ['entity']
        },
        'subEntities': {
            deps: ['subEntity']
        },

        //LIB
        'underscore': {
            exports: '_'
        },
        'jquery':{
            deps: [],
            exports: '$'
        },
        'backbone': {
            deps    : ['jquery', 'underscore'],
            exports : 'Backbone'
        },
        'text' : {
            exports : 'text'
        },
        /*'joint':{
            deps:[],
            exports;''            
        },
        'lodash':{
            deps: [],
            exports:'_'
        },*/


        // Models
        'appStates': {
            deps: ['backbone']
        },
        'attribute': {
            deps: ['backbone']
        },
        'attributeType': {
            deps: ['backbone']
        },
        'baseEntity': {
            deps: ['backbone', 'attributes']
        },
        'elementType': {
            deps: ['backbone']
        },

        //VIEWS
        'appView':{
            deps: ['backbone','underscore']
        },
        'dataToolbarView':{            
            deps: ['backbone','underscore']
        },
        'elementToolbarView':{
            deps: ['backbone','underscore']
           },
        'fieldView':{
            deps: ['backbone','underscore']
        }, 
        'homeView':{
            deps: ['backbone','underscore']
        },
        'robustnessDiagramView':{
            deps: ['backbone','underscore']
        },

        //altro
        /*'app': {
            deps: ['attribute'],
            exports: 'app'
        },*/
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
})
