/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @constructor
 */
function UniversalEditor(id, config) {
    'use strict';
    var moduleName = 'unEditor-' + id;
    var unEditor = $('#' + id);
    if (unEditor[0]) {
        var app = angular.module(moduleName, ['universal.editor', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
            configDataProvider.setConfig(moduleName, config); 
        });

        unEditor.append("<div data-ui-view='" + moduleName + "'></div>");
        angular.bootstrap(unEditor[0], [moduleName]);
    }
}

