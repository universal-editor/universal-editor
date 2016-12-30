/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @constructor
 */
 debugger;
var angular1 = window.angular;
window.angular = {};
require("angular");
require("angular-moment");
var angular2 = window.angular;
window.angular = angular1;


define("universal-editor", ["require"], function(require) {
    return function(id, config) {
        'use strict';
        debugger;
        var moduleName = 'unEditor-' + id;
        var unEditor = $('#' + id);
        if (unEditor[0]) {
            var app = angular.module(moduleName, ['universal.editor', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
                configDataProvider.setConfig(id, config);
            });
            unEditor.append("<div class='u-editors' data-ui-view='" + id + "'></div>");
            angular.bootstrap(unEditor[0], [moduleName]);
        }
    };
});

require('./universal-editor.module.js');
require('./localization.configFile.js');
var context = require.context('./components', true, /\.js$/);
    context.keys().forEach(context);
require('universal-editor');
/*['./components', './controllers', './directives', './factories', './provider', './services'].forEach(function(dir) {
    var context = require.context(dir, true, /\.js$/);
    context.keys().forEach(context);
});*/


