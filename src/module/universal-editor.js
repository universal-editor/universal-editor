/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @constructor
 */
var UniversalEditor = {
    constructor: function(id, config) {
        'use strict';
        var moduleName = 'unEditor-' + id;
        var unEditor = $('#' + id);
        if (unEditor[0]) {
            var app = angular.module(moduleName, ['universal.editor', 'ui.bootstrap']).config(['$stateProvider', '$urlRouterProvider', '$injector', 'configDataProvider', function($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
                configDataProvider.setConfig(id, config);
            }]);
            unEditor.append("<div class='u-editors' data-ui-view='" + id + "'></div>");
            angular.bootstrap(unEditor[0], [moduleName]);
        } 
    },
    angular: angular
};


